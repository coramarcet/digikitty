import { useState } from 'react'
import ribbit from './assets/ribbit.jpg'
import './App.css'

// type Cat = {
//   id: number,
//   name: string,
//   breed: string,
//   age: string,
//   avatar: string,
//   status: string,
//   weight: string,
//   nextCare: string
// }

const cats = [
  {
    id: 1,
    name: 'Ribbit',
    breed: 'N/A',
    age: '1 year',
    avatar: 'MI',
    status: 'Stable',
    weight: 'TBD',
    nextCare: 'Ex. Dental cleaning due in 18 days',
  },
]

const documents = [
  { title: 'Rabies certificate', date: 'May 12, 2026', tag: 'Vaccine' },
  { title: 'Annual exam summary', date: 'Apr 03, 2026', tag: 'Visit' },
  { title: 'Dental x-rays', date: 'Jan 19, 2026', tag: 'Imaging' },
]

function App() {
  const [selectedCat, setSelectedCat] = useState(cats[0])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Kitty Health</p>
          <h1>Welcome back, Joaquin</h1>
        </div>
        <button className="icon-button" aria-label="Open alerts">!</button>
      </header>

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
          <p>{selectedCat.nextCare}</p>
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
