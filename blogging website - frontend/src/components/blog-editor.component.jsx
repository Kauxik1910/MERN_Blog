import { Link, useNavigate, useParams } from "react-router-dom";
import lightlogo from "../imgs/logo-light.png";
import darklogo from "../imgs/logo-dark.png";
import AnimationWrapper from "../common/page-animation";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import generateURL from "../common/aws";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs"
import { tools } from "./tools.component";
import axios from "axios";
import { ThemeContext, UserContext } from "../App";

const BlogEditor = () => {

    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

    let { userAuth: { access_token } } = useContext(UserContext)
    let {theme} = useContext(ThemeContext)
    let {blog_id } = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Let's write an awesome story"
            }))
        }
    }, [])


    const saveImage = async (e) => {

        let image = e.target.files[0];

        if (image) {
            let url = await generateURL(image)
            setBlog({ ...blog, banner: url })
            toast.success("Uploaded 👍")
        }

        else {
            return toast.error("Please Upload image")
        }
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }

    const handleError = (e) => {
        let img = e.target;

        img.src = theme == "light" ? lightBanner : darkBanner;
    }

    const handlePublishEvent = (e) => {

        if (!banner.length) {
            return toast.error("Upload a blog banner to publish it")
        }
        if (!title.length) {
            return toast.error("Write blog title to publish it")
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditorState("publish")
                } else {
                    return toast.error("Write something in your blog to publish it")
                }
            })
                .catch((err) => {
                    console.log(err);
                })
        }

    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            return toast.error("Write blog title before saving it as a draft")
        }

        let loadingToast = toast.loading("Saving Draft...");

        e.target.classList.add('disable');

        if (textEditor.isReady) {
            textEditor.save().then(content => {
                let blogObj = {
                    title, banner, des, content, tags, draft: true
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id: blog_id}, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                    .then(() => {
                        e.target.classList.remove('disable');

                        toast.dismiss(loadingToast);
                        toast.success("Saved 👍");

                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=draft")
                        }, 500)
                    })
                    .catch(({ response }) => {
                        e.target.classList.remove('disable');

                        toast.dismiss(loadingToast);

                        return toast.error(response.data.error)
                    })
            })
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={theme == "light" ? darklogo : lightlogo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <Toaster />

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">

                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={banner} className="z-20" onError={handleError} />
                                {/* {image
                                    ? <img
                                        className="z-20"
                                        src={image ? URL.createObjectURL(image) : ""}
                                        alt="img"
                                    />
                                    : <img
                                        src={defaultBanner}
                                        className="z-20"
                                    />} */}
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={saveImage}
                                />
                            </label>
                        </div>

                        <textarea defaultValue={title} placeholder="Blog Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white" onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;