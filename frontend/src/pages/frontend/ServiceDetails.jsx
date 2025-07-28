import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiurl, apiurl2 } from "../../components/frontend/Http";
import Swal from "sweetalert2";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(apiurl2 + `services/${id}`);
        const result = await res.json();

        if (result.status) {
          setService(result.data);
        } else {
          console.error("Service not found");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(apiurl2 + "bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          service_id: id,
        }),
      });

      const result = await res.json();

      if (result.status) {
        Swal.fire("Success", "Booking submitted successfully!", "success");
        setFormData({ name: "", email: "", phone: "", address: "" });
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit booking", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!service) {
    return (
      <div className="text-center py-10 text-red-600">Service not found</div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">
            {service.title}
          </h1>
          <p className="text-sm text-gray-500 italic mt-1">Slug: {service.slug}</p>
        </div>

        {/* Image */}
        <div className="mb-6">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-64 object-contain rounded-xl"
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-semibold text-gray-700">Short Description</h4>
            <p className="text-gray-600">{service.short_desc}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Content</h4>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Price</h4>
            <p className="text-gray-600">৳ {parseFloat(service.price).toLocaleString()}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Timeline</h4>
            <p className="text-gray-600">{service.timeline || "N/A"}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Book this Service</h2>

          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="border px-4 py-2 rounded-md"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="border px-4 py-2 rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              required
              placeholder="Phone Number"
              className="border px-4 py-2 rounded-md"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              required
              placeholder="Address"
              className="border px-4 py-2 rounded-md"
              value={formData.address}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 col-span-1 md:col-span-2 mt-4"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
