import React from 'react';
import Modal from './Modal';
import { Award, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose, attempt, studentName }) => {
  if (!attempt) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `CERT-QVS-${(attempt.attemptId || '101').replace('att-', '').slice(-6).toUpperCase()}`;
  const dateFormatted = new Date(attempt.completedAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Certificate of Achievement"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Certificate ID: <strong>{certificateId}</strong>
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
            <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Printer size={15} /> Print / Save as PDF
            </button>
          </div>
        </div>
      }
    >
      <div className="certificate-print-wrapper" style={{
        background: '#ffffff',
        color: '#0f172a',
        padding: '2.5rem',
        borderRadius: '12px',
        border: '8px double #f59e0b',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        margin: '0.5rem 0'
      }}>
        {/* Certificate Watermark Stamp */}
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          opacity: 0.12,
          pointerEvents: 'none'
        }}>
          <Award size={130} color="#6366f1" />
        </div>

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={24} color="#f59e0b" />
          <span style={{
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: '#4f46e5',
            textTransform: 'uppercase'
          }}>
            Quiziverse Educational Assessment Platform
          </span>
          <Sparkles size={24} color="#f59e0b" />
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', serif",
          fontSize: '2rem',
          fontWeight: 800,
          color: '#1e293b',
          margin: '0.5rem 0 0.25rem'
        }}>
          Certificate of Excellence
        </h1>

        <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          This is proudly presented to
        </p>

        {/* Recipient Name */}
        <div style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          color: '#4f46e5',
          borderBottom: '2px solid #e2e8f0',
          display: 'inline-block',
          padding: '0 2rem 0.4rem',
          marginBottom: '1.25rem'
        }}>
          {studentName || 'Student Scholar'}
        </div>

        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          For successfully completing the rigorous online assessment on{' '}
          <strong style={{ color: '#0f172a' }}>"{attempt.quizTitle}"</strong>, demonstrating exceptional conceptual mastery.
        </p>

        {/* Score & Marks Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Final Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              {attempt.percentage}%
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: '#cbd5e1' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Marks Earned</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5' }}>
              {attempt.marksObtained !== undefined ? attempt.marksObtained : attempt.correctCount} / {attempt.totalMarks || attempt.totalQuestions} Marks
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: '#cbd5e1' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Verified Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={16} /> PASSED
            </div>
          </div>
        </div>

        {/* Signatures & Issue Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Issued On</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{dateFormatted}</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: '#d97706'
            }}>
              <Award size={28} />
            </div>
            <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>SEAL OF MASTERY</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display', cursive, serif", fontSize: '1.2rem', color: '#4f46e5', fontWeight: 700 }}>
              Quiziverse Faculty
            </div>
            <div style={{ width: 130, height: 1, background: '#cbd5e1', margin: '4px 0 4px auto' }} />
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Academic Board Verified</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateModal;
