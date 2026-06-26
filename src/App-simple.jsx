import React from 'react'
import './App.css'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#1e293b', margin: '0' }}>
          AI Cert Studio Practice Exams
        </h1>
        <p style={{ color: '#64748b', margin: '10px 0 0 0' }}>
          SAFe & Azure Certification Practice
        </p>
      </header>

      <main style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1e293b' }}>Welcome to AI Cert Studio</h2>
        <p style={{ color: '#64748b' }}>
          Your comprehensive platform for SAFe and Azure certification practice exams.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{
            background: '#f1f5f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>
              Leading SAFe 6
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 15px 0' }}>
              Practice exam for Leading SAFe 6.0 certification
            </p>
            <button style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Start Practice
            </button>
          </div>

          <div style={{
            background: '#f1f5f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>
              SAFe for Teams 6.0
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 15px 0' }}>
              Practice exam for SAFe for Teams 6.0 certification
            </p>
            <button style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Start Practice
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App