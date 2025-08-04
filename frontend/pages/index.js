
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { apiService } from '../utils/api.js';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [userId, setUserId] = useState('');
  const [image, setImage] = useState(null);
  const [cashback, setCashback] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setError('');
    try {
      const data = await apiService.fetchTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`No se pudo cargar el listado de tickets: ${err.message}`);
      setTickets([]);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setError('');
    if (!userId || !image) {
      setError('Usuario e imagen son requeridos');
      return;
    }

    setLoading(true);
    try {
      await apiService.createTicket(userId, image);
      setUserId('');
      setImage(null);
      await fetchTickets();
    } catch (err) {
      setError(`No se pudo subir el ticket: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    setError('');
    try {
      await apiService.updateTicketStatus(id, status);
      await fetchTickets();
    } catch (err) {
      setError(`No se pudo cambiar el estado: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await apiService.deleteTicket(id);
      await fetchTickets();
    } catch (err) {
      setError(`No se pudo borrar el ticket: ${err.message}`);
    }
  }

  async function handleCashback(id) {
    setSelectedId(id);
    setCashback('...');
    setError('');
    
    try {
      const ticket = tickets.find(t => t.id === id);
      if (ticket && ticket.status !== 'approved') {
        setCashback(null);
        setSelectedId(null);
        setError('El ticket debe estar aprobado para consultar el cashback.');
        return;
      }
      
      const data = await apiService.getCashback(id);
      setCashback(data.cashback);
    } catch (err) {
      setCashback(null);
      setSelectedId(null);
      setError(`No se pudo consultar el cashback: ${err.message}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tickets System</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleUpload} className={styles.form}>
          <input
            placeholder="User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            required
            className={styles.fileInput}
          />
          <button type="submit" disabled={loading} className={styles.button}>Subir Ticket</button>
        </form>
        <h2 className={styles.title} style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Listado de Tickets</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={`${styles.th} ${styles.thLeft}`}>ID</th>
                <th className={styles.th}>User</th>
                <th className={styles.th}>Estado</th>
                <th className={`${styles.th} ${styles.thRight}`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ background: '#fff', borderBottom: '1px solid #e0e7ff' }}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{t.id}</td>
                  <td className={styles.td}>{t.user_id}</td>
                  <td className={styles.td}>
                    <span className={
                      `${styles.status} ` +
                      (t.status === 'approved' ? styles.statusApproved : t.status === 'rejected' ? styles.statusRejected : styles.statusPending)
                    }>{t.status}</span>
                  </td>
                  <td className={styles.td}>
                    <button onClick={() => handleStatus(t.id, 'approved')} className={`${styles.actionButton} ${styles.approve}`}>Aprobar</button>
                    <button onClick={() => handleStatus(t.id, 'rejected')} className={`${styles.actionButton} ${styles.reject}`}>Rechazar</button>
                    <button onClick={() => handleDelete(t.id)} className={`${styles.actionButton} ${styles.delete}`}>Borrar</button>
                    <button onClick={() => handleCashback(t.id)} className={`${styles.actionButton} ${styles.cashback}`}>Ver Cashback</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedId !== null && cashback !== null && !error && (
          <div className={styles.modalOverlay} onClick={() => { setSelectedId(null); setCashback(null); }}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <button onClick={() => { setSelectedId(null); setCashback(null); }} className={styles.closeButton}>&times;</button>
              <h3 className={styles.modalTitle}>Cashback del Ticket #{selectedId}</h3>
              <div className={styles.modalCashback}>${cashback}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
