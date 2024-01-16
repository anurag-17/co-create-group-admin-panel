import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import DeleteScheduledCall from "./modal/DeleteScheduledCall";
import Pagination from "../pagination/Pagination";
import Loader from "../websiite-loader/Index";
import { BASE_URL } from "../config";
import CloseIcon from "../Svg/CloseIcon";
import CallIcon from "../../assets/svg/call.svg";

export const headItems = ["S. No.", "Date", "contact number", "Action"];

const ScheduleMeeting = () => {
  const [allData, setAllData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [openAddPopup, setAddPopup] = useState(false);
  const [openEditPopup, setEditPopup] = useState(false);
  const [openDeletePopup, setDeletePopup] = useState(false);
  const [allPagesName, setPagesName] = useState([]);
  const visiblePageCount = 10;

  useEffect(() => {
    getAllData(1);
  }, [isRefresh]);

  const getAllData = (pageNo) => {
    setLoader(true);
    const options = {
      method: "GET",
      url: `${BASE_URL}/api/schedule/getAllSchedules?page=${pageNo}&limit=${visiblePageCount}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          setAllData(res?.data);
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

  const handleEdit = (id) => {
    setUpdateId(id);
    try {
      setLoader(true);
      const options = {
        method: "GET",
        url: `${BASE_URL}/api/contacts/getContact/${id}`,
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

  const handleCallFunction = (phoneNumber) => {
    const telLink = `tel:${phoneNumber}`;
    window.open(telLink, '_blank');
  };

  // Add this function to format the date and time
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString('en-GB'); // Adjust the locale as needed
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return { formattedDate, formattedTime };
};

  return (
    <>
      {isLoader && <Loader />}
      <section className="py-[30px] px-[20px] mt-[20px] lg:mt-0">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[15px] flex justify-between items-center px-[20px]">
            <p className=" text-[22px] font-semibold">Schedule Call List</p>
            <div className="flex gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3  items-center justify-center md:justify-end"></div>
          </div>
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
                {Array.isArray(allData?.schedules) &&
                  allData?.schedules?.length > 0 &&
                  allData?.schedules?.map((items, index) => {
                    const { formattedDate, formattedTime } = formatDateTime(items?.date);
                    return(
                      <tr key={index}>
                        <td className="text-[14px] font-[400] py-3 px-5">
                          {index + 1}
                        </td>
                        <td className="text-[14px] font-[400] py-3 px-5 capitalize">
                        {formattedDate}&nbsp; &nbsp;{formattedTime}
                        </td>
                        <td className="text-[14px] font-[400] py-3 px-5">
                          {(items?.number)}
                        </td>
                        <td className="text-[14px] font-[400] py-3 px-5">
                          <div className="flex flex-col md:flex-row items-center gap-x-5">
                            <button
                              className="px-4  text-[13px] border rounded h-[32px] text-[black] hover:bg-black/60 hover:text-white flex items-center gap-1 "
                              onClick={() => handleCallFunction(items?.number)}
                            >
                              Make a Call
                              {/* <img src={CallIcon} alt="call" className="h-[20px] w-[20px]"/> */}
                            </button>
                            <button
                              className="px-4 text-[13px] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a]"
                              onClick={() => handleDelete(items?._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          {Array.isArray(allData?.schedules) &&
            allData?.schedules?.length === 0 && (
              <div className="py-4 px-4 w-full flex flex-col items-center justify-center border border-[#f3f3f3] bg-white rounded-[20px] mt-[10px]">
                <p className="text-[18px] fontsemibold">No data</p>
              </div>
            )}
        </div>

        {allData?.pagination?.total_pages > 1 && (
          <Pagination
            currentpage={allData?.pagination?.current_page}
            totalCount={allData?.pagination?.total_pages}
            visiblePageCount={visiblePageCount}
            getAllData={getAllData}
          />
        )}
      </section>

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
                  <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[25px] top-[20px] cursor-pointer"
                    onClick={closeDeleteModal}
                  >
                    <CloseIcon />
                  </div>
                  {/* <Dialog.Title className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-center md:text-left">
                    Delete page
                  </Dialog.Title> */}
                  <DeleteScheduledCall
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

export default ScheduleMeeting;
