import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";

const AddNewPage = ({ closeAddPopup, refreshdata, pageData }) => {
  const [formData, setFormData] = useState({
    email: "",
    number: "",
    address: "",
  });
  const [isLoading, setLoading] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("sessionToken"));

  const InputHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/contacts/createContact`,
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
        toast.success("Contact details added successfully.");
        setLoading(false);
        refreshdata();
        closeAddPopup();
      } else {
        toast.error("Invalid details");
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
      <div className="">
        <form action="" className="" onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center lg:px-8 py-4">
            <div className="pt-3">
              <div className="py-2 ">
                <span className="login-input-label capitalize"> phone :</span>
                <input
                  type="text"
                  name="number"
                  placeholder="Enter mobile number"
                  className="login-input w-full mt-1  "
                  onChange={InputHandler}
                  // pattern="[0-9]"
                  title="enter only number"
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
                  onChange={InputHandler}
                  required
                  maxLength={500}
                ></textarea>
              </div>
            </div>
            <div className="py-1 px-4 text-[red] bg-[#f8cece] text-[14px] font-normal rounded">
              Note* : If you add new contact details old details will be deleted
            </div>
            <div className="flex pt-6 items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
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
