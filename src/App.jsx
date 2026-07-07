import { useState, useEffect } from 'react'
import ribbit from './assets/ribbit.jpg'
import './App.css'

function App() {
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBreed, setNewCatBreed] = useState("");
  const [newCatAge, setNewCatAge] = useState("");
  const [newCatWeight, setNewCatWeight] = useState("");
  const [newCatStatus, setNewCatStatus] = useState("");
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
        breed: newCatBreed,
        age: Number(newCatAge),
        weight: Number(newCatWeight),
        avatar: newCatName.charAt(0).toUpperCase(),
        status: newCatStatus,
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
    setNewCatBreed("");
    setNewCatAge("");
    setNewCatWeight("");
    setNewCatStatus("");
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DigiKitty</p>
          <h1>Welcome!</h1>
        </div>
      </header>

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
            placeholder="Status"
            value={newCatStatus}
            onChange={(e) => setNewCatStatus(e.target.value)}
          />

          <input
            type="text"
            placeholder="Next Care"
            value={newCatNextCare}
            onChange={(e) => setNewCatNextCare(e.target.value)}
          />

          <input
            type="text"
            placeholder="Medications"
            value={newCatMedications}
            onChange={(e) => setNewCatMedications(e.target.value)}
          />

          <button onClick={createCat}>
            Create Cat
          </button>

          <button onClick={() => setShowAddCatForm(false)}>
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
              <small>{cat.breed} - {cat.age}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">{selectedCat.name}'s health</p>
          <h2>Current status: {selectedCat.status}</h2>
          <p>Next care: {selectedCat.nextCare}</p>
        </div>
        <div className="score-ring">
          <strong>86</strong>
          <small>score</small>
        </div>
      </section>

      <section className="grid">
        <article className="panel metric">
          <span>Weight</span>
          <strong>{selectedCat.weight}</strong>
          <small>+0.2 lb over 30 days</small>
        </article>
        <article className="panel metric">
          <span>Medication</span>
          <strong>{selectedCat.medications}</strong>
          <small>Next dose: N/A</small>
        </article>
        <article className="panel metric">
          <span>Vet visits</span>
          <strong>1 upcoming</strong>
          <small>{selectedCat.nextCare}</small>
        </article>
      </section>

      <section>
        <article className="documents">
          <p>Medical Documents</p>
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

              <button onClick={uploadDocument}>
                Upload Document
              </button>

              <button onClick={() => setShowUploadForm(false)}>
                Cancel
              </button>

            </div>
          )}
          <div className="document-list">
            {documents.map((doc) => (
              <div className="document-card" key={doc._id}>
                <strong>{doc.title}</strong>

                <p>{doc.type}</p>

                <small>{doc.visitDate}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button>Home</button>
        <button>Health</button>
        <button>Docs</button>
        <button>Care</button>
      </nav>
    </main>
  )
}

export default App
