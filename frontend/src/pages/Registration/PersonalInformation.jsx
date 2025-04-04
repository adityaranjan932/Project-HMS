import React from 'react';

const CourseRegistrationForm = ({ formData, handleChange }) => (
  <div className="space-y-5 animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h2>
    
    <div className="grid grid-cols-1 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
        >
          <option value="">Select Course</option>
          <option value="51">Acharya</option>
          <option value="174">ADVANCE DIPLOMA (CLINICAL NUTRITION AND DIETETICS)</option>
          <option value="54">B.A. (Yoga)(NEP)</option>
          <option value="44">B.A.M.S. FINAL PROFESSIONAL (NEW COURSE)</option>
          <option value="41">B.A.M.S. FIRST PROFESSIONAL (NEW COURSE)</option>
          <option value="42">B.A.M.S. SECOND PROFESSIONAL (NEW COURSE)</option>
          <option value="43">B.A.M.S. THIRD PROFESSIONAL (NEW COURSE)</option>
          <option value="149">B.B.A. (RETAIL MANAGEMENT)</option>
          <option value="24">B.COM</option>
          <option value="25">B.COM (HONS)</option>
          <option value="26">B.COM (NEP)</option>
          <option value="56">B.Ed</option>
          <option value="100">B.El.Ed.</option>
          <option value="50">B.LIB.</option>
          <option value="60">B.P.Ed.</option>
          <option value="10">B.Pharma</option>
          <option value="37">B.Sc.</option>
          <option value="62">B.Sc. (Ag) (Hons)</option>
          <option value="64">B.Sc. (Ag) (Hons) (NEP)</option>
          <option value="123">B.Sc. (Ag) HONOURS Dean Committee ( 2020-2021)</option>
          <option value="40">B.Sc. (HOME SC.)(NEP)</option>
          <option value="39">B.Sc. (NEP)</option>
          <option value="65">B.Sc.(Yoga) (NEP)</option>
          <option value="11">B.Tech (Civil Engineering)</option>
          <option value="153">B.Tech (Civil Engineering) NEP</option>
          <option value="12">B.Tech (Computer Science and Engineering- Artificial Intelligence)</option>
          <option value="154">B.Tech (Computer Science and Engineering- Artificial Intelligence) NEP</option>
          <option value="13">B.Tech (Computer Science and Engineering)</option>
          <option value="155">B.Tech (Computer Science and Engineering) NEP</option>
          <option value="14">B.Tech (Electrical Engineering)</option>
          <option value="156">B.Tech (Electrical Engineering) NEP</option>
          <option value="15">B.Tech (Electronics and Communication Engineering)</option>
          <option value="157">B.Tech (Electronics and Communication Engineering) NEP</option>
          <option value="16">B.Tech (Mechanical Engineering)</option>
          <option value="158">B.Tech (Mechanical Engineering) NEP</option>
          <option value="115">B.U.M.S. FINAL PROFESSIONAL</option>
          <option value="113">B.U.M.S. SECOND PROFESSIONAL</option>
          <option value="114">B.U.M.S. THIRD PROFESSIONAL</option>
          <option value="68">B.VOC(Renewable Energy Technology) (NEP)</option>
          <option value="70">B.VOC. (SOFTWARE DEVELOPMENT)(NEP)</option>
          <option value="35">BA</option>
          <option value="36">BA (NEP)</option>
          <option value="71">BACHELOR OF FINE ARTS</option>
          <option value="72">BACHELOR OF VISUAL ART (APPLIED ART)</option>
          <option value="73">BACHELOR OF VISUAL ART (PAINTING)</option>
          <option value="74">BACHELOR OF VISUAL ART (SCULPTURE)</option>
          <option value="3">BBA</option>
          <option value="1">BBA (IB)</option>
          <option value="105">BBA (NEP)</option>
          <option value="107">BBA (NEP) (IB)</option>
          <option value="106">BBA (NEP) (MS)</option>
          <option value="173">BBA (NEP) (TOURISM & HOSPITALITY)</option>
          <option value="108">BBA (NEP) (TOURISM)</option>
          <option value="17">BCA</option>
          <option value="159">BCA (NEP)</option>
          <option value="59">BJMC(NEP)</option>
          <option value="101">BPA KATHAK</option>
          <option value="102">BPA TABLA</option>
          <option value="103">BPA VOCAL</option>
          <option value="104">DIPLOMA IN TRANSLATION</option>
          <option value="30">LL.B (5 Year) (NEP)</option>
          <option value="111">LL.B (5 Year) 2017</option>
          <option value="29">LL.B (5 Year) 2018</option>
          <option value="34">LL.B (5 Year) 2019</option>
          <option value="31">LL.B.(3 YEARS)</option>
          <option value="32">LL.B.(3 YEARS) (NEP)</option>
          <option value="33">LL.M</option>
          <option value="76">M.COM. APPLIED ECONOMICS CBCS</option>
          <option value="77">M.COM. COMMERCE</option>
          <option value="78">M.Ed EDUCATION (CBCS)</option>
          <option value="80">M.H.A</option>
          <option value="81">M.LIB. AND INFORMATION SCIENCE</option>
          <option value="83">M.Sc.</option>
          <option value="82">M.Sc.(Ag.)</option>
          <option value="169">M.Tech (Artificial Intelligence)</option>
          <option value="171">M.Tech (Cyber Security)</option>
          <option value="170">M.Tech. (Electronics and Communication Engineering)</option>
          <option value="145">M.Tech. (Electrical Engineering)</option>
          <option value="146">M.Tech. (Mechanical Engineering)</option>
          <option value="61">MA</option>
          <option value="84">MASTER IN PUBLIC HEALTH</option>
          <option value="85">MASTER OF PHYSICAL EDUCATION (M.P.Ed.)</option>
          <option value="86">MASTER OF POPULATION STUDIES</option>
          <option value="87">MASTER OF PUBLIC HEALTH (COMMUNITY MEDICINE)</option>
          <option value="88">MASTER OF SOCIAL WORK</option>
          <option value="89">MASTER OF TOURISM AND TRAVEL MANAGEMENT</option>
          <option value="90">MASTER OF VISUAL ART (APPLIED ART)</option>
          <option value="91">MASTER OF VISUAL ART (PAINTING)</option>
          <option value="92">MASTER OF VISUAL ART (SCULPTURE)</option>
          <option value="161">MBA (23-24)</option>
          <option value="172">MBA (BUSINESS ANALYTICS)</option>
          <option value="19">MBA (Enterpreneurship and Family Business)</option>
          <option value="21">MBA (Finance and Accounting)</option>
          <option value="6">MBA (Finance and Control)</option>
          <option value="7">MBA (Human Resource)</option>
          <option value="8">MBA (International Business)</option>
          <option value="9">MBA (Marketing)</option>
          <option value="18">MCA</option>
          <option value="162">MD UNANI FINAL YEAR</option>
          <option value="163">MS (MAHIR - E-JARAHAT) TASHREEH-UL-BADAN (ANATOMY) FINAL YEAR</option>
          <option value="138">PG DIPLOMA</option>
          <option value="175">PG DIPLOMA IN COUNSELLING</option>
          <option value="96">PG DIPLOMA IN DISASTER RELIEF & REHABILITATION</option>
          <option value="98">PG DIPLOMA IN YOGA</option>
          <option value="99">SHASTRI</option>
        </select>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-5">
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
        >
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
        >
          <option value="">Exam Type</option>
          <option value="regular">Regular</option>
        </select>
      </div>
    </div>
    
   
    
    <div className="grid grid-cols-2 gap-5">
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Roll No. *</label>
        <input
          type="text"
          name="rollno"
          value={formData.rollno}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
          placeholder="Enter your roll number"
          maxLength="15"
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (DD/MM/YYYY) *</label>
        <input
          type="text"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
          placeholder="DD/MM/YYYY"
          maxLength="10"
        />
      </div>
    </div>
    
    <div className="text-xs text-gray-500 mt-4">
      Fields marked with * are required
    </div>
  </div>
);

export default CourseRegistrationForm;
