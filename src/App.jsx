import { useState, useEffect } from 'react'
import ribbit from './assets/ribbit.jpg'
import './App.css'

const documents = [
  { title: 'Rabies certificate', date: 'May 12, 2026', tag: 'Vaccine' },
  { title: 'Annual exam summary', date: 'Apr 03, 2026', tag: 'Visit' },
  { title: 'Dental x-rays', date: 'Jan 19, 2026', tag: 'Imaging' },
]

function App() {
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatBreed, setNewCatBreed] = useState("");
  const [newCatAge, setNewCatAge] = useState("");
  const [newCatWeight, setNewCatWeight] = useState("");
  const [newCatStatus, setNewCatStatus] = useState("");
  const [newCatNextCare, setNewCatNextCare] = useState("");

  async function loadCats() {
    try {
      const response = await fetch("http://localhost:5000/api/cats");
      const data = await response.json();

      setCats(data);

      if (data.length > 0) {
        setSelectedCat(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadCats();
  }, []);

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
        nextCare: newCatNextCare
      })
    });

    const cat = await response.json();
    
    await loadCats();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DigiKitty</p>
          <h1>Welcome!</h1>
        </div>
        <button className="icon-button" aria-label="Open alerts">!</button>
      </header>

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
          placeholder="Age"
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

        <button onClick={createCat}>
          Create Cat
        </button>
      </div>

      <section className="cat-strip" aria-label="Cat profiles">
        {cats.map((cat) => (
          <button
            className={`cat-card ${selectedCat.id === cat.id ? 'active' : ''}`}
            key={cat.id}
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
          <h2>{selectedCat.status} health trend</h2>
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
          <strong>2 doses</strong>
          <small>Next dose tonight</small>
        </article>
        <article className="panel metric">
          <span>Vet visits</span>
          <strong>1 upcoming</strong>
          <small>Wellness exam scheduled</small>
        </article>
      </section>

      <section className="panel documents">
        <div className="section-header">
          <div>
            <p className="eyebrow">Medical documents</p>
            <h2>Care vault</h2>
          </div>
          <button className="primary-button">Upload</button>
        </div>

        <div className="doc-list">
          {documents.map((doc) => (
            <article className="doc-row" key={doc.title}>
              <div className="doc-icon">PDF</div>
              <div>
                <strong>{doc.title}</strong>
                <small>{doc.date}</small>
              </div>
              <span>{doc.tag}</span>
            </article>
          ))}
        </div>
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

// function App() {
//   return (
//     <div>
//       <h1>digikitty Web App</h1>
//       <p>Welcome!</p>
//       <img src={ribbit} width="300"></img>
//     </div>
//   )
// }

// export default App
