import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSignup } from '../../context/SignupContext';
import { jwtDecode } from "jwt-decode";

const CreateAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasSignedUp } = useSignup(); 
  const { email, password, token } = location.state || {};
  const [inviterId, setInviterId] = useState(null);

  // Form state variables
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [sname, setSname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ppsno, setPpsno] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('');
  const [taxStatus, setTaxStatus] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [occupation, setOccupation] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  // Convert image file to Base64 string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Decode token and set inviterId
  useEffect(() => {
    if (!hasSignedUp) {
      navigate('/signup');
      return;
    }

    if (!token) {
      setInviterId(null);
      alert('Invalid or missing token. Please sign up again.');
      navigate('/signup');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      
      if (decoded.inviter_id) {
        setInviterId(decoded.inviter_id);
      } else {
        setInviterId(null);
        alert('Inviter ID not found in token. Please sign up again.');
        navigate('/signup');
      }

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        alert('Token has expired. Please sign up again.');
        navigate('/signup');
      }

    } catch (error) {
      console.error('Error decoding token:', error);
      setInviterId(null);
      alert('Invalid token. Please sign up again.');
      navigate('/signup');
    }
  }, [hasSignedUp, navigate, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !fname || 
      !sname || 
      !phoneNumber || 
      !dateOfBirth || 
      !ppsno || 
      !addressLine1 || 
      !city || 
      !country || 
      !taxStatus || 
      !maritalStatus || 
      !occupation || 
      !currency ||
      image === null
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      let imageBase64 = null;
      if (image) {
        imageBase64 = await convertImageToBase64(image);
      }

      // Create the JSON payload
      const payload = {
        fname,
        mname,
        sname,
        email,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        ppsno,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        county,
        country,
        tax_status: taxStatus,
        marital_status: maritalStatus,
        postal_code: postalCode,
        occupation,
        currency,
        password,
        inviter_id: inviterId,
        image: imageBase64,
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Account created successfully:', response.data);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error creating account:', error.response.data.error);
        alert(`Error creating account: ${error.response.data.error}`);
      } else {
        console.error('Error creating account:', error.message);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <main>
      <header>
        <h1>Create Account</h1>
      </header>
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <label htmlFor="fname"><span className="required">*</span> First Name:</label>
        <input
          type="text"
          id="fname"
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />

        {/* Middle Name */}
        <label htmlFor="mname">Middle Name:</label>
        <input
          type="text"
          id="mname"
          placeholder="Middle Name"
          value={mname}
          onChange={(e) => setMname(e.target.value)}
        />

        {/* Surname */}
        <label htmlFor="sname"><span className="required">*</span> Surname:</label>
        <input
          type="text"
          id="sname"
          placeholder="Surname"
          value={sname}
          onChange={(e) => setSname(e.target.value)}
          required
        />

        {/* Phone Number */}
        <label htmlFor="phoneNumber"><span className="required">*</span> Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        {/* Date of Birth */}
        <label htmlFor="dateOfBirth"><span className="required">*</span> Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />

        {/* Government ID Number */}
        <label htmlFor="ppsno"><span className="required">*</span> Government ID Number (e.g. PPSNO):</label>
        <input
          type="text"
          id="ppsno"
          placeholder="ID Number"
          value={ppsno}
          onChange={(e) => setPpsno(e.target.value)}
          required
        />

        {/* Address Line 1 */}
        <label htmlFor="addressLine1"><span className="required">*</span> Address Line 1:</label>
        <input
          type="text"
          id="addressLine1"
          placeholder="Address Line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />

        {/* Address Line 2 */}
        <label htmlFor="addressLine2"> Address Line 2:</label>
        <input
          type="text"
          id="addressLine2"
          placeholder="Address Line 2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />

        {/* City */}
        <label htmlFor="city"><span className="required">*</span> City:</label>
        <input
          type="text"
          id="city"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        {/* County */}
        <label htmlFor="county">County:</label>
        <input
          type="text"
          id="county"
          placeholder="County"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        />

        {/* Country */}
        <label htmlFor="country"><span className="required">*</span> Country:</label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="" disabled>Select Country</option>
          <option value="Ireland">Ireland</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Japan">Japan</option>
        </select>

        {/* Postal Code */}
        <label htmlFor="postalCode">Postal Code:</label>
        <input
          type="text"
          id="postalCode"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        {/* Tax Status */}
        <label htmlFor="taxStatus"><span className="required">*</span> Tax Status:</label>
        <select
          id="taxStatus"
          value={taxStatus}
          onChange={(e) => setTaxStatus(e.target.value)}
          required
        >
          <option value="" disabled>Select Tax Status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="student">Student</option>
          <option value="retired">Retired</option>
        </select>

        {/* Marital Status */}
        <label htmlFor="maritalStatus"><span className="required">*</span> Marital Status:</label>
        <select
          id="maritalStatus"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          required
        >
          <option value="" disabled>Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>

        {/* Occupation */}
        <label htmlFor="occupation"><span className="required">*</span> Occupation:</label>
        <input
          type="text"
          id="occupation"
          placeholder="Occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          required
        />

        {/* Currency */}
        <label htmlFor="currency"><span className="required">*</span> Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        {/* ID Image Upload */}
        <div className="custom-file-upload-wrapper">
          <label className={`custom-file-upload ${imageName ? 'uploaded' : ''}`}>
            <span className="required">*</span> {imageName ? 'Image Uploaded! Change ID Image?' : 'Upload ID Image'}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default CreateAccount;
