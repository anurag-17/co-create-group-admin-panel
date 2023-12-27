import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Loader from "../websiite-loader/Index";
import axios from "axios";
import AddNewPage from "./modals/AddPages";
import { BASE_URL } from "../config";
import Pagination from "../pagination/Pagination";
import EditPage from "./modals/EditPage";
import DeletePage from "./modals/DeletePages";
import VideoPopup from "./modals/VideoPopup";
import CloseIcon from "../Svg/CloseIcon";

export const headItems = [
  "S. No.",
  "Page title",
  "Page subtitle",
  "paragraph",
  "subpage",
  "Video",
  "Action",
];

const Pages = () => {
  const [allData, setAllData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideo, setOpenVideo] = useState(false);
  const [openAddPopup, setAddPopup] = useState(false);
  const [openEditPopup, setEditPopup] = useState(false);
  const [openDeletePopup, setDeletePopup] = useState(false);
  const visiblePageCount = 10;
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));

  useEffect(() => {
    getAllData(1);
  }, [isRefresh]);

  const getAllData = (pageNo) => {
    setLoader(true);
    const options = {
      method: "GET",
      url: `${BASE_URL}/api/pages/getAllPages?page=${pageNo}&limit=${visiblePageCount}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response?.data);
        if (response.status === 200) {
          setLoader(false);
          setAllData(response?.data);
        } else {
          setLoader(false);
          return;
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error:", error);
      });
  };

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  const closeAddPopup = () => {
    setAddPopup(false);
  };

  const handleVideo = (vid) => {
    setOpenVideo(true);
    setVideoUrl(vid)
  };

  const closeVideoModal = () => {
    setOpenVideo(false);
  };

  const handleEdit = (id) => {
    setUpdateId(id);
    try {
      setLoader(true);
      const options = {
        method: "GET",
        url: `${BASE_URL}/api/pages/getPage/${id}`,
        headers: {
          // Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            // console.log(response);
            setLoader(false);
            setEditData(response?.data);
            setEditPopup(true);
          } else {
            setLoader(false);
            return;
          }
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error:", error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const closeEditPopup = () => {
    setEditPopup(false);
  };

  const handleDelete = (id) => {
    setUpdateId(id);
    setDeletePopup(true);
  };

  const closeDeleteModal = () => {
    setDeletePopup(false);
  };


  return (
    <>
      {isLoader && <Loader />}
      <section>
        <div className="py-[30px] px-[20px] mx-auto mt-[20px] bg-[#f3f3f3] lg:mt-0 ">
          <div className="rounded-[10px] bg-white py-[15px] flex justify-center md:justify-between gap-x-20 items-center flex-wrap md:flex-auto gap-y-5 px-[20px]">
            <p className=" text-[24px] font-semibold text-left ">Page</p>
            <div className="flex gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3  items-center justify-center md:justify-end">
              <button
                className="custom-button whitespace-nowrap md:w-auto w-full"
                onClick={() => setAddPopup(true)}
              >
                Add new page
              </button>
            </div>
          </div>
          {Array.isArray(allData?.pages) &&
            allData?.pages?.length > 0 && (
              <div className="rounded-[10px] bg-white py-[30px] px-[20px] flex justify-between items-center mt-[20px] p-6 overflow-x-scroll">
                <table className="w-full min-w-[640px] table-auto mt-[20px] ">
                  <thead className="">
                    <tr className=" ">
                      {headItems.map((items, inx) => (
                        <th className="py-3 px-5 text-left bg-white" key={inx}>
                          <p className="block text-[13px] font-medium uppercase text-[#72727b]">
                            {items}
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {allData?.pages?.map((items, index) => (
                      <tr key={index}>
                        <td className="text-[14px] font-[400] py-3 px-5">
                          {index +
                            1 +
                            10 * (allData?.page - 1)}
                        </td>
                        <td className="text-[14px] font-[400] py-3 px-5 uppercase">
                          {items?.title}
                        </td>
                      
                        <td className="text-[14px] font-[400] py-3 px-5 ">
                          {items?.subTitle ? items?.subTitle : "-"}
                        </td>
                      
                        <td className="text-[14px] font-[400] py-3 px-5 ">
                          {items?.paragraph}
                        </td>
                      
                        <td className="text-[14px] font-[400] py-3 px-5 ">
                          {items?.isSubpage ? "Yes" : "No"}
                        </td>
                      
                        <td className="text-[14px] font-[400] px-5 cursor-pointer py-3 ">
                          <div
                            className="whitespace-nowrap border border-[#407cb892] bg-[#f0f8ff] hover:bg-[#e3eef7] px-3 py-1 rounded cursor-pointer text-center"
                            onClick={() => handleVideo(items?.bgUrl)}
                          >
                            Video
                          </div>
                        </td>
                        <td className="text-[14px] font-[400] py-3 px-5">
                          <div className="flex flex-col md:flex-row items-center gap-x-3 gap-y-3">
                            <button
                              className="px-4 text-[13px] border rounded h-[25px] text-[gray] hover:bg-[#aba9a945] hover:text-[gray] md:w-auto w-full"
                              onClick={() => handleEdit(items?._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-4 text-[13px] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a] md:w-auto w-full"
                              onClick={() => handleDelete(items?._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {Array.isArray(allData?.pages) &&
            allData?.pages?.length === 0 && (
              <div className="py-4 px-4 w-full flex flex-col items-center justify-center border border-[#f3f3f3] bg-white rounded-[20px] mt-[10px]">
                <p className="text-[18px] fontsemibold">No data</p>
              </div>
            )}
        </div>

        {allData?.totalPages > 1 && (
          <Pagination
            currentpage={allData?.page}
            totalCount={allData?.totalPages}
            visiblePageCount={visiblePageCount}
            getAllData={getAllData}
          />
        )}

      </section>

   {/*---------- Video popup---------- */}

   <Transition appear show={openVideo} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeVideoModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-black/70" />
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
                <Dialog.Panel className="w-auto max-w-[800px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[15px] top-[15px] cursor-pointer"
                    onClick={closeVideoModal}
                  >
                    <CloseIcon />
                  </div>

                  <VideoPopup closeModal={closeVideoModal} data={videoUrl} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*---------- Add popup---------- */}
      <Transition appear show={openAddPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
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
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white py-10 px-2 md:px-12 text-left align-middle shadow-xl transition-all">
                <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[25px] top-[20px] cursor-pointer"
                    onClick={closeAddPopup}
                  >
                    <CloseIcon />
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-center md:text-left px-2"
                  >
                    Add new page 
                  </Dialog.Title>
                  <AddNewPage
                    closeAddPopup={closeAddPopup}
                    refreshdata={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/*---------- Edit popup---------- */}
      <Transition appear show={openEditPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
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
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white py-10 px-2 md:px-12 text-left align-middle shadow-xl transition-all">
                <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[25px] top-[20px] cursor-pointer"
                    onClick={closeEditPopup}
                  >
                    <CloseIcon />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-center md:text-left px-2"
                  >
               Edit page content
                  </Dialog.Title>
                  <EditPage
                    closeEditPopup={closeEditPopup}
                    refreshdata={refreshData}
                    editData={editData}
                    updateId={updateId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/*---------- Delete popup---------- */}
      <Transition appear show={openDeletePopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
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
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-2 md:px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-center md:text-left"
                  >
               Delete page 
                  </Dialog.Title>
                  <DeletePage
                    refreshdata={refreshData}
                    closeModal={closeDeleteModal}
                    deleteId={updateId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Pages;
