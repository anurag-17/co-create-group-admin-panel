import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import Loader from "../../websiite-loader/Index";

const AddNewPage = ({ closeAddPopup, refreshdata }) => {
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    paragraph: "",
    bgUrl: "",
  });
  const [video, setVideo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoDisable, setVideoDisable] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));

  const InputHandler = (e) => {
   if (e.target.name === "bgUrl") {
      setVideo({ file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const uploadVideo = async () => {
    setVideoUploading(true);
    try {
      if (!video) {
        setVideoUploading(false);
        return toast.warn("Please upload video");
      }

      const response = await axios.post(`${BASE_URL}/api/auth/upload`, video, {
        headers: {
          "authorization": `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        const videoUrl = response?.data?.url;
        setFormData({ ...formData,[ "bgUrl"]: videoUrl});
        setVideoDisable(true);
        setVideoUploading(false);
      } else {
        setVideoDisable(false);
        setVideoUploading(false);
      }
    } catch (error) {
      console.error(
        "Error uploading video:",
        error.response?.data || error.message
      );
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.file == "") {
      toast.error("Please upload video");
    } else {
      console.log(formData);
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/pages/createPage`, formData, {
          headers: {
            "authorization": `${token}`,
            "Content-Type": "application/json",
          },
        });
console.log(response)
        if (response.status === 201) {
          toast.success("Category created successfully.");
          setLoading(false);
          refreshdata();
          closeAddPopup()()
        } else {
            toast.error("Invalid details");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during category:", error);
        toast.error("Something went wrong, try again later.");
        setLoading(false);
      }
    }
  };

  return (
    <>
      {videoUploading && <Loader />}
      <div className="">
        <form action="" className="" onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center px-4 lg:px-8 py-4">
            <div className="py-2 ">
              <span className="login-input-label capitalize"> title :</span>
              <input
                type="text"
                name="title"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter page title"
                className="login-input w-full mt-1 capitalize "
                onChange={InputHandler}
                required
              />
            </div>

            <div className="py-2 ">
              <span className="login-input-label capitalize"> subtitle :</span>
              <input
                type="text"
                name="subTitle"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter page subtitle"
                className="login-input w-full mt-1 capitalize "
                onChange={InputHandler}
                required
              />
            </div>

            <div className="py-2 ">
              <span className="login-input-label capitalize"> paragraph :</span>
              <input
                type="text"
                name="paragraph"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter category paragraph"
                className="login-input w-full mt-1 capitalize "
                onChange={InputHandler}
                required
              />
            </div>

            <div className="py-2 mt-1 flex  items-end gap-x-10">
              <div className="w-[50%]">
                <span className="login-input-label cursor-pointer mb-1">
                 Background video :
                </span>
                <div className="flex items-center  w-full mt-1">
                  <input
                    id="video"
                    type="file"
                    name="bgUrl"
                    className="w-full"
                    onChange={InputHandler}
                    disabled={videoDisable}
                    accept="video/mp4,video/x-m4v,video/*"
                  />
                </div>
              </div>
              <div className="">
                <button
                  className={`focus-visible:outline-none  text-white text-[13px] px-4 py-1 rounded
                            ${videoDisable ? "bg-[green]" : "bg-[#070708bd]" }`}
                  type="button"
                  onClick={uploadVideo}
                  disabled={videoDisable || videoUploading}
                >
                  {videoDisable ? "Uploaded": videoUploading ? "Loading..": "Upload" }
                </button>
              </div>
            </div>

            <div className="py-2 ">
              <span className="login-input-label capitalize"> title :</span>
              <input
                type="text"
                name="title"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter page title"
                className="login-input w-full mt-1 capitalize "
                onChange={InputHandler}
                required
              />
            </div>
            
            <div className="mt-4 flex pt-6 items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
              <button
                type="button"
                className="rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border border-[gray] bg-white text-black"
                onClick={() => closeAddPopup()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="custom-button rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border text-white"
              >
                {isLoading ? "Loading.." : "Add"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewPage;