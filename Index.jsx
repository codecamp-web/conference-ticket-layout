import { useState } from "react";

export default function Index() {
  const [form, setForm] = useState({ name: "", email: "", ticketType: "", avatar: null });
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.ticketType || !form.avatar) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email format.");
      return;
    }

    setError("");
    setIsSubmitted(true);

    const formData = new FormData();
    formData.append("avatar", form.avatar, "ogheneochuko");
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("ticketType", form.ticketType);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Submission failed.");
      alert("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-20 p-10 shadow-lg border-2  rounded-lg">
      <div className="p-4 text-center ">
        <h2 className="text-2xl font-bold mb-4 text-red-400">Ticket Generator</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
           <input type="file" onChange={handleFileChange} accept="image/*" className="w-full p-2 border rounded" required aria-label="Upload Avatar" />
            <input type="text"  name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required aria-label="Email Address" />
            <select name="ticketType" value={form.ticketType} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">Select Ticket Type</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="Student">Student</option>
              <option value="Children">Children</option>
            </select>
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
          </form>
        ) : (
          <div className="bg-white p-4 border rounded shadow-lg w-80 text-center">
            {imagePreview && <img src={imagePreview} alt="Uploaded Avatar" className="mt-4 w-32 h-32 object-cover rounded-full mx-auto" />}
            <h2 className="text-xl font-bold">Conference Ticket</h2>
            <p className="mt-2 text-lg">Name: {form.name}</p>
            <p className="text-lg">Email: {form.email}</p>
            <p className="text-gray-600">Ticket Type: {form.ticketType}</p>
            <button onClick={() => setIsSubmitted(false)} className="mt-4 bg-gray-500 text-white p-2 rounded">Submit Another</button>
          </div>
        )}
      </div>
    </div>
  );
}
