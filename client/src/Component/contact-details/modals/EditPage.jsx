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
    id:updateId
  });
  const [isLoading, setLoading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));

 

  const InputHandler = (e) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/contacts/updateContact`,
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
        toast.success("Category updated Successfully.");
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

  return (
    <>
      <form action="" className="" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center px-4 py-4 md:px-8 max-h-[600px] overflow-y-scroll">
        <div className="pt-3">
              <div className="py-2 ">
                <span className="login-input-label capitalize"> phone :</span>
                <input
                  type="text"
                  name="number"
                  placeholder="Enter mobile number"
                  className="login-input w-full mt-1  "
                  defaultValue={editData?.number}
                  onChange={InputHandler}
                  required
                />
              </div>

              <div className="py-2 ">
                <span className="login-input-label capitalize"> email :</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className="login-input w-full mt-1  "
                  defaultValue={editData?.email}
                  onChange={InputHandler}
                  required
                />
              </div>

              <div className="py-2 ">
                <span className="login-input-label capitalize"> Address :</span>
                <textarea
                  type="text"
                  name="address"
                  placeholder="Enter location"
                  className="login-input w-full mt-1 h-[100px] "
                  defaultValue={editData?.address}
                  onChange={InputHandler}
                  required
                  maxLength={500}
                ></textarea>
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

  
    </>
  );
};

export default EditPage;
