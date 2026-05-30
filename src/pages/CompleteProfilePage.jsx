import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {fetchProfile,updateProfile} from "../api/auth"
import {
  fetchCustomersDetails,
  updateCustomersDetails,
} from "../api/customers";

import {
  fetchAddress,
  updateAddress,
} from "../api/address";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const cartId = state?.cartId;


  const {data: profile }=useQuery({
    queryKey:["profile-details"],
    queryFn:fetchProfile,
  })
  // -----------------------------
  // CUSTOMER QUERY
  // -----------------------------
  const { data: customer } = useQuery({
    queryKey: ["customer-details"],
    queryFn: fetchCustomersDetails,
  });

  // -----------------------------
  // ADDRESS QUERY
  // -----------------------------
  const { data: address } = useQuery({
    queryKey: ["customer-address"],
    queryFn: fetchAddress,
  });

  // -----------------------------
  // FORM STATE
  // -----------------------------
  const [formData, setFormData] = useState({
    first_name: "",
    last_name:"",
    phone: "",
    street: "",
    city: "",
    province: "",
  });

  // -----------------------------
  // PREFILL DATA
  // -----------------------------
  useEffect(() => {
    if (profile || customer || address) {
       setFormData({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: customer?.phone || "",
        street: address?.street || "",
        city: address?.city || "",
        province: address?.province || "",
      });
    }
  }, [profile,customer, address]);


//profile update 
const profileMutation = useMutation({
    mutationFn: updateProfile,
});

  // -----------------------------
  // CUSTOMER UPDATE
  // -----------------------------
  const customerMutation = useMutation({
    mutationFn: updateCustomersDetails,
  });

  // -----------------------------
  // ADDRESS UPDATE
  // -----------------------------
  const addressMutation = useMutation({
    mutationFn: updateAddress,
  });

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //update profile
      await profileMutation.mutateAsync({
first_name: formData.first_name,
last_name:formData.last_name,
      })
      // UPDATE CUSTOMER
      await customerMutation.mutateAsync({
       
        phone: formData.phone,
      });

      // UPDATE ADDRESS
      await addressMutation.mutateAsync({
        street: formData.street,
        city: formData.city,
        province: formData.province,
      });

      // REDIRECT BACK TO CHECKOUT
      navigate("/checkout", {
        state:{
          cartId,
          buyNow: state?.buyNow,
        }
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      <div className="border rounded-xl p-6 shadow-sm">

        <h1 className="text-2xl font-bold mb-6">
          Complete Your Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}
          <div>
            <label className="block mb-2 font-medium">
             First Name
            </label>

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter your first name"
              required
            />
          </div>
<div>
            <label className="block mb-2 font-medium">
             Last Name
            </label>

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter your last name"
              required
            />
          </div>
          {/* PHONE */}
          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="98XXXXXXXX"
              required
            />
          </div>

          {/* STREET */}
          <div>
            <label className="block mb-2 font-medium">
              Street Address
            </label>

            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Street / Area"
              required
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Kathmandu"
              required
            />
          </div>

          {/* PROVINCE */}
          <div>
            <label className="block mb-2 font-medium">
              Province
            </label>

            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Bagmati"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              customerMutation.isPending ||
              addressMutation.isPending
            }
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            {customerMutation.isPending ||
            addressMutation.isPending
              ? "Saving..."
              : "Save & Continue"}
          </button>

        </form>
      </div>
    </div>
  );
}