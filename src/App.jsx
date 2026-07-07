import { useState, useEffect } from 'react'
import ribbit from './assets/ribbit.jpg'
import './App.css'
import CareCalendar from "./components/CareCalendar";

function App() {
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBirthday, setNewCatBirthday] = useState("");
  const [newCatBreed, setNewCatBreed] = useState("");
  const [newCatAge, setNewCatAge] = useState("");
  const [newCatWeight, setNewCatWeight] = useState("");
  const [newCatNextCareDate, setNewCatNextCareDate] = useState("");
  const [newCatNextCare, setNewCatNextCare] = useState("");
  const [newCatMedications, setNewCatMedications] = useState("");
  const [showAddCatForm, setShowAddCatForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  async function loadCats() {
    try {
      const response = await fetch("http://localhost:5000/api/cats");
      const data = await response.json();

      setCats(data);

      if (data.length > 0 && !selectedCat) {
        setSelectedCat(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadCats();
  }, []);

  useEffect(() => {
    if (selectedCat) {
        loadDocuments(selectedCat._id);
    }
  }, [selectedCat]);

  if (!selectedCat) {
    return <p>Loading...</p>;
  }

  async function createCat() {
    const response = await fetch("http://localhost:5000/api/cats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newCatName,
        birthday: newCatBirthday,
        breed: newCatBreed,
        age: Number(newCatAge),
        weight: Number(newCatWeight),
        avatar: newCatName.charAt(0).toUpperCase(),
        nextCareDate: newCatNextCareDate,
        nextCare: newCatNextCare,
        medications: newCatMedications
      })
    });

    const cat = await response.json();
    
    await loadCats();

    // Select the newly created cat
    setSelectedCat(cat);

    // Hide the form
    setShowAddCatForm(false);

    // Clear the inputs for next time
    setNewCatName("");
    setNewCatBirthday("");
    setNewCatBreed("");
    setNewCatAge("");
    setNewCatWeight("");
    setNewCatNextCareDate("");
    setNewCatNextCare("");
    setNewCatMedications("");
  }

  async function uploadDocument() {
    const formData = new FormData();
    formData.append("catId", selectedCat._id);
    formData.append("title", documentTitle);
    formData.append("type", documentType);
    formData.append("visitDate", documentDate);
    formData.append("pdf", selectedFile);
    const response = await fetch(
      "http://localhost:5000/api/documents",
      {
        method: "POST",
        body: formData
      }
    );

    const document = await response.json();

    await loadDocuments(selectedCat._id);

    setShowUploadForm(false);

    // Clear inputs
    setDocumentTitle("");
    setDocumentType("");
    setDocumentDate("");
    setSelectedFile(null);
  }

  async function loadDocuments(catId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/documents/${catId}`
      );

      const data = await response.json();

      setDocuments(data);

    } catch (err) {
        console.error(err);
    }
  }

  const events = [];

  cats.forEach((cat) => {
    if (cat.birthday) {
      const birthday = new Date(cat.birthday);

      const birthdayThisYear = new Date(
          new Date().getFullYear(),
          birthday.getMonth(),
          birthday.getDate()
      );

      events.push({
          title: `🎂 ${cat.name}'s Birthday`,
          start: birthdayThisYear,
          end: birthdayThisYear,
          type: "birthday"
      });
    }
    if (cat.nextCareDate) {
      events.push({
        title: `🩺 ${cat.name} - ${cat.nextCare}`,
        start: new Date(cat.nextCareDate),
        end: new Date(cat.nextCareDate)
      });
    }
  });

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DigiKitty</p>
          <h1>Welcome!</h1>
        </div>
      </header>

      <section className="panel">
        <h2>Calendar📅</h2>

        <CareCalendar events={events} />
      </section>

      <button
        className="primary-button"
        onClick={() => setShowAddCatForm(true)}
      >
        + Add Cat
      </button>

      {showAddCatForm && (
        <div className="add-cat-form">
          <h2>Add a Cat</h2>

          <input
            type="text"
            placeholder="Name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />

          <input
            type="date"
            placeholder="Birthday"
            value={newCatBirthday}
            onChange={(e) => setNewCatBirthday(e.target.value)}
          />

          <input
            type="text"
            placeholder="Breed"
            value={newCatBreed}
            onChange={(e) => setNewCatBreed(e.target.value)}
          />

          <input
            type="number"
            placeholder="Age (yrs)"
            value={newCatAge}
            onChange={(e) => setNewCatAge(e.target.value)}
          />

          <input
            type="number"
            placeholder="Weight (lbs)"
            value={newCatWeight}
            onChange={(e) => setNewCatWeight(e.target.value)}
          />

          <input
            type="text"
            placeholder="Next care"
            value={newCatNextCare}
            onChange={(e) => setNewCatNextCare(e.target.value)}
          />

          <input
            type="date"
            placeholder="Next Care Date"
            value={newCatNextCareDate}
            onChange={(e) => setNewCatNextCareDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Medications"
            value={newCatMedications}
            onChange={(e) => setNewCatMedications(e.target.value)}
          />

          <button className="small-button" onClick={createCat}>
            Create Cat
          </button>

          <button className="small-button" onClick={() => setShowAddCatForm(false)}>
            Cancel
          </button>
        </div>
      )}

      <section className="cat-strip" aria-label="Cat profiles">
        {cats.map((cat) => (
          <button
            className={`cat-card ${selectedCat?._id === cat._id ? 'active' : ''}`}
            key={cat._id}
            onClick={() => setSelectedCat(cat)}
          >
            <span className="avatar">{cat.avatar}</span>
            <span>
              <strong>{cat.name}</strong>
              <small>{cat.breed} - {cat.age} yr(s)</small>
            </span>
          </button>
        ))}
      </section>

      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">{selectedCat.name}'s upcoming appointments🩺</p>
          <h2>Next appointment: {selectedCat.nextCare}</h2>
          <p>
            {new Date(selectedCat.nextCareDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
          </p>
        </div>
      </section>

      <section className="grid">
        <article className="panel metric">
          <span>Weight📊</span>
          <strong>{selectedCat.weight} lbs</strong>
          <small>+0.2 lb over 30 days</small>
        </article>
        <article className="panel metric">
          <span>Medication💊</span>
          <strong>{selectedCat.medications}</strong>
          <small>Next dose: N/A</small>
        </article>
      </section>

      <section>
        <article className="documents">
          <p>Medical Documents📄</p>
          <button
            className="primary-button"
            onClick={() => setShowUploadForm(true)}
          >
            Upload
          </button>

          {showUploadForm && (
            <div className="upload-form">

              <h2>Upload Medical Document</h2>

              <input
                type="text"
                placeholder="Document Title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />

              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option>Vaccination Record</option>
                <option>Rabies Certificate</option>
                <option>Spay/Neuter Certificate</option>
                <option>General Vet Visit</option>
              </select>

              <input
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
              />

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <button className="small-button" onClick={uploadDocument}>
                Upload Document
              </button>

              <button className="small-button" onClick={() => setShowUploadForm(false)}>
                Cancel
              </button>

            </div>
          )}
          <div className="document-list">
            {documents.map((doc) => (
              <div
                className="document-card"
                key={doc._id}
                onClick={() =>
                  window.open(
                    `http://localhost:5000/api/documents/view/${doc._id}`,
                    "_blank"
                  )
                }
              >
                <div className="document-info">
                  <h3>{doc.title}</h3>

                  <p>{doc.type}</p>

                  <small>
                    {new Date(doc.visitDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
