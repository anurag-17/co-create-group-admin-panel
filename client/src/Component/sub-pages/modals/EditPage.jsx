import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../websiite-loader/Index";
import { BASE_URL } from "../../config";
import VideoPopup from "../../pages/modals/VideoPopup";

const EditPage = ({
  closeEditPopup,
  editData,
  refreshdata,
  updateId,
  pageData,
}) => {
  // console.log(editData);
  const [edit, setEdit] = useState({
    id: updateId,
  });
  const [videoDisable, setVideoDisable] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [video, setVideo] = useState("");
  const [videoview, setVideoview] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));
  const [isVideoRemoved, setVideoRemoved] = useState(false);
  // console.log(edit);

  const handleVideo = (vid) => {
    setVideoview(vid);
    setOpenVideo(true);
  };

  const removeVideo = (videoUrl) => {
    setEdit({ ...edit, [`bgUrl`]: "" });
    setVideoRemoved(true);
    return;
    setLoading(true);

    const options = {
      method: "DELETE",
      url: `${BASE_URL}/api/pages/`,
      data: {
        bgUrl: videoUrl,
      },
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setLoading(false);
          toast.success("Removed successfully !");
          refreshdata();
        } else {
          setLoading(false);
          toast.error("Failed. something went wrong!");
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
        toast.error("Failed. something went wrong!");
      });
  };

  const closeVideoModal = () => {
    setOpenVideo(false);
  };

  const InputHandler = (e) => {
    if (e.target.name === "bgUrl") {
      setVideo({ file: e.target.files[0] });
    } else {
      setEdit({ ...edit, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/subPages/updateSubPage`,
        edit,
        {
          headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // console.log('Login successful');
        toast.success("Subpage updated Successfully.");
        setLoading(false);
        closeEditPopup();
        refreshdata();
      } else {
        // console.log(response);

        toast.error(response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during category:", error);

      toast.error("Something went wrong, try again later.");
      setLoading(false);
    }
  };

  const uploadVideo = async () => {
    try {
      if (!video) {
        return toast.warn("Please select a file.");
      }
      setVideoUploading(true);
      const response = await axios.post(`${BASE_URL}/api/auth/upload`, video, {
        headers: {
          authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // console.log('Video uploaded:', response?.data);
        const videoUrl = response?.data?.url;

        setEdit({ ...edit, bgUrl: videoUrl });
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
      // Handle the error: show a message or perform an action accordingly
    }
  };
  return (
    <>
      {videoUploading && <Loader />}
      <form action="" className="" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center px-4 py-4 md:px-8 max-h-[600px] overflow-y-scroll">
          <div className="py-2">
            <span className="login-input-label capitalize"> title :</span>
            <input
              type="text"
              name="title"
              defaultValue={editData?.title}
              placeholder="Enter title"
              className="login-input w-full mt-1 "
              onChange={InputHandler}
              required
            />
          </div>
          <div className="py-2">
            <span className="login-input-label capitalize"> subtitle :</span>
            <input
              type="text"
              name="subTitle"
              defaultValue={editData?.subTitle}
              placeholder="Enter subtitle"
              className="login-input w-full mt-1 "
              onChange={InputHandler}
            />
          </div>
          <div className="py-2">
            <span className="login-input-label capitalize"> paragraph :</span>
            <input
              type="text"
              name="paragraph"
              defaultValue={editData?.paragraph}
              placeholder="Enter paragraph"
              className="login-input w-full mt-1 "
              onChange={InputHandler}
            />
          </div>

          <div className="py-2 ">
            <span className="login-input-label "> Main page :</span>

            <select
              name="pageId"
              id=""
              onChange={InputHandler}
              // defaultValue={editData?.pageId?.title}
              value={editData?.pageId?.title || ""}
              className="login-input w-full mt-1  "
            >
              <option value="">Choose main page</option>
              {pageData?.map((item) => (
                <option key={item?._id} value={item?._id}>
                  {item?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="py-2 flex  items-end gap-x-10">
            <div className="w-[50%]">
              <span className="login-input-label cursor-pointer mb-3">
                Video :
              </span>
              {editData?.bgUrl !== "" && !isVideoRemoved && (
                <div className="p-1 flex">
                  <div
                    className={`text-[14px] font-[400] cursor-pointer text-[blue] whitespace-nowrap`}
                    onClick={() => handleVideo(editData?.bgUrl)}
                  >
                    background video
                  </div>
                  <button
                    type="button"
                    className={`text-[14px] px-4 font-[400] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a] ml-4`}
                    onClick={() => removeVideo(editData?.bgUrl)}
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="flex items-center  w-full pt-4">
                <input
                  type="file"
                  name="bgUrl"
                  className="w-full "
                  id="video"
                  onChange={InputHandler}
                  accept="video/mp4,video/x-m4v,video/*"
                  disabled={videoDisable}
                />
              </div>
            </div>
            <div className="">
              <button
                className={`focus-visible:outline-none  text-white text-[13px] px-4 py-1 rounded
                                    ${
                                      videoDisable
                                        ? "bg-[green]"
                                        : "bg-[#070708bd]"
                                    }`}
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
          <div className="mt-4 pt-2 flex items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
            <button
              type="button"
              className="secondary_btn"
              onClick={() => closeEditPopup()}
            >
              Cancel
            </button>
            <button type="submit" className="primary_btn" disabled={isLoading}>
              {isLoading ? "Loading.." : "Update"}
            </button>
          </div>
        </div>
      </form>

      <Transition appear show={openVideo} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeVideoModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="xl:text-[20px] text-[18px] text-right font-medium leading-6 text-gray-900">
                    close
                  </Dialog.Title>

                  <VideoPopup closeModal={closeVideoModal} data={videoview} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditPage;
