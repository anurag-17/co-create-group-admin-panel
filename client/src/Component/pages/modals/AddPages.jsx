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
    isSubpage: false,
  });

  const [video, setVideo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [videoDisable, setVideoDisable] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));

  const InputHandler = (e) => {
    if (e.target.name === "bgUrl") {
      setVideo({ file: e.target.files[0] });
    } else if (e.target.name === "isSubpage") {
      setFormData({ ...formData, isSubpage: e.target.value === "yes" });
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
          authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        const videoUrl = response?.data?.url;
        setFormData({ ...formData, ["bgUrl"]: videoUrl });
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
    if (formData.bgUrl == "") {
      toast.error("Please upload video");
    } else {
      // console.log(formData);
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/pages/createPage`,
          formData,
          {
            headers: {
              authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.status === 201) {
          toast.success("Page added successfully.");
          setLoading(false);
          refreshdata();
          closeAddPopup();
        } else if (response.status === 203) {
          toast.error(response?.data?.error);
          setLoading(false);
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
          <div className="flex flex-col justify-center px-4 lg:px-8 py-4 max-h-[600px] overflow-y-scroll ">
            <div className="py-2 ">
              <span className="login-input-label capitalize"> title :</span>
              <input
                type="text"
                name="title"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter page title"
                className="login-input w-full mt-1 "
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
                className="login-input w-full mt-1 "
                onChange={InputHandler}
              />
            </div>

            <div className="py-2 ">
              <span className="login-input-label capitalize"> paragraph :</span>
              <input
                type="text"
                name="paragraph"
                // pattern="^(?!\s)[a-zA-Z ]{1,}$"
                placeholder="Enter category paragraph"
                className="login-input w-full mt-1 "
                onChange={InputHandler}
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
                            ${videoDisable ? "bg-[green]" : "bg-[#070708bd]"}`}
                  type="button"
                  onClick={uploadVideo}
                  disabled={videoDisable || videoUploading}
                >
                  {videoDisable
                    ? "Uploaded"
                    : videoUploading
                    ? "Loading.."
                    : "Upload"}
                </button>
              </div>
            </div>

            <div className="py-2 flex md:flex-row flex-col md:items-center gap-x-5 mt-2  md:mt-0">
              <span className="login-input-label">
                Are you want to add subpage :
              </span>
              <div className="flex gap-x-10 py-3">
                {/* Radio input for option 1 */}
                <label className="text-[14px] flex gap-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    name="isSubpage"
                    checked={formData.isSubpage === true}
                    onChange={InputHandler}
                  />
                  Yes
                </label>

                {/* Radio input for option 2 */}
                <label className="text-[14px] flex gap-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    name="isSubpage"
                    checked={formData.isSubpage === false}
                    onChange={InputHandler}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
              <button
                type="button"
                className="secondary_btn"
                onClick={() => closeAddPopup()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="primary_btn"
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
