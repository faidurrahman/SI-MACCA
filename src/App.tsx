/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Calendar, 
  FileText, 
  Plus, 
  Cloud, 
  ChevronRight, 
  ExternalLink,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  FilePlus,
  Mail,
  X,
  Clock,
  Check,
  Upload,
  ChevronDown,
  MapPin,
  Edit,
  Download,
  Filter,
  ArrowRight,
  CalendarRange
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_URL, DISPOSISI_OPTIONS } from './constants';

// --- Types ---
type View = 'Login' | 'Beranda' | 'Jadwal' | 'Laporan';

interface UserProfile {
  name: string;
  title: string;
  initials: string;
}

interface AuthUser {
  username: string;
  role: 'ADMIN' | 'GUEST';
}

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  status: 'HADIR' | 'DI DISPOSISI';
  date: string;
  rawDate?: string;
  location?: string;
  dressCode?: string;
  notes?: string;
  organizer?: string;
  disposisiTo?: string[];
  linkUndangan?: string;
}

// --- Mock Data ---
const AGENDAS: AgendaItem[] = [
  {
    id: '1',
    time: '09.00 WITA',
    title: 'Rapat Koordinasi MBG (Makanan Bergizi Gratis) Lintas Sektor',
    status: 'DI DISPOSISI',
    date: 'Sen 16',
    location: 'Ruang Pertemuan Lt. 2',
    dressCode: 'Batik',
    notes: 'Membahas persiapan program makanan bergizi gratis untuk sekolah dasar.',
    organizer: 'Camat Ujung Pandang',
    disposisiTo: ['SEKCAM', 'KASI KESRA']
  },
  {
    id: '2',
    time: '09.00 WITA',
    title: 'Kegiatan Sertijab Dinas Pemberdayaan Perempuan dan Anak',
    status: 'HADIR',
    date: 'Sen 16',
    location: 'Aula Balaikota Makassar',
    dressCode: 'Pdh',
    notes: 'Menghadiri serah terima jabatan kepala dinas baru.',
    organizer: 'Dinas PPPA'
  },
  {
    id: '3',
    time: '13.30 WITA',
    title: 'Evaluasi Kinerja Triwulan I Kecamatan Ujung Pandang',
    status: 'HADIR',
    date: 'Sen 16',
    location: 'Ruang Rapat Camat',
    dressCode: 'Pdh',
    notes: 'Review pencapaian target kinerja bulan Januari - Maret.',
    organizer: 'Bagian Organisasi'
  },
  {
    id: '4',
    time: '15.00 WITA',
    title: 'Sosialisasi Program Kebersihan Lingkungan Kelurahan',
    status: 'DI DISPOSISI',
    date: 'Sen 16',
    location: 'Kantor Lurah Maloku',
    dressCode: 'Bebas Rapi',
    notes: 'Edukasi pemilahan sampah rumah tangga.',
    organizer: 'Kasi Trantibun',
    disposisiTo: ['KASI TRANTIBUN']
  }
];

// --- Components ---

const LoginView = ({ onLogin, onGuestAccess }: { onLogin: (u: string, p: string) => void, onGuestAccess: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden"
      >
        <div className="p-8 lg:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-xl shadow-blue-900/20 mb-4">
              M
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">SI-MACCA</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sistem Informasi Manajemen Agenda Camat Cepat & Akurat</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => onLogin(username, password)}
              className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98]"
            >
              Masuk Sebagai Admin
            </button>
            <button 
              onClick={onGuestAccess}
              className="w-full bg-white border border-gray-100 text-gray-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Masuk Sebagai Tamu
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kecamatan Ujung Pandang &copy; 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

const EditProfileModal = ({ isOpen, onClose, profile, onSave }: { isOpen: boolean, onClose: () => void, profile: UserProfile, onSave: (p: UserProfile) => void }) => {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);

  useEffect(() => {
    setName(profile.name);
    setTitle(profile.title);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <h2 className="text-xl font-black text-blue-900 tracking-tight uppercase">Edit Profil</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Jabatan</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  onSave({ name, title, initials });
                  onClose();
                }}
                className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
              >
                Simpan
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AgendaModal = ({ isOpen, onClose, agenda = null, onRefresh }: { isOpen: boolean, onClose: () => void, agenda?: AgendaItem | null, onRefresh: () => void }) => {
  const [status, setStatus] = useState<'HADIR' | 'DI DISPOSISI'>('HADIR');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDisposisi, setSelectedDisposisi] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<{ data: string, name: string } | null>(null);
  
  const disposisiOptions = DISPOSISI_OPTIONS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile({
          data: event.target?.result as string,
          name: selectedFile.name
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (agenda) {
      setStatus(agenda.status);
      setTitle(agenda.title);
      setOrganizer(agenda.organizer || '');
      setLocation(agenda.location || '');
      setDressCode(agenda.dressCode || '');
      setNotes(agenda.notes || '');
      setSelectedDisposisi(agenda.disposisiTo || []);
      setFile(null);

      // Parse time (e.g., "09:00 WITA" -> "09:00")
      if (agenda.time) {
        const timeMatch = agenda.time.match(/(\d{2}[:.]\d{2})/);
        if (timeMatch) {
          setTime(timeMatch[1].replace('.', ':'));
        }
      }

      // Parse date (e.g., "Kamis, 19 Februari 2026" or "2026-02-19")
      if (agenda.date) {
        if (agenda.date.includes('-')) {
          setDate(agenda.date);
        } else {
          // If it's a formatted string, we might need a more complex parser or 
          // just hope the user picks a new date if it fails.
          // For now, let's try to handle common Indonesian date format
          const months: { [key: string]: string } = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
            'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
            'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
          };
          const parts = agenda.date.split(' ');
          if (parts.length >= 4) {
            const day = parts[1].padStart(2, '0');
            const month = months[parts[2]];
            const year = parts[3];
            if (day && month && year) {
              setDate(`${year}-${month}-${day}`);
            }
          }
        }
      }
    } else {
      setStatus('HADIR');
      setTitle('');
      setOrganizer('');
      setLocation('');
      setDressCode('');
      setNotes('');
      setSelectedDisposisi([]);
      setFile(null);
      setDate('');
      setTime('');
    }
  }, [agenda, isOpen]);

  const handleSave = async () => {
    if (!title || !date || !time) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Mohon isi Nama Kegiatan, Tanggal, dan Waktu.',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        action: agenda ? 'UPDATE' : 'CREATE',
        id: agenda?.id || `AGD-${Date.now()}`,
        tanggal: date,
        waktu: time,
        nama_kegiatan: title,
        penyelenggara: organizer,
        lokasi: location, // Swapped to match sheet column order
        status: status,   // Swapped to match sheet column order
        pakaian: dressCode,
        keterangan: notes,
        disposisi_ke: selectedDisposisi.join(', '),
        fileData: file?.data || "",
        fileName: file?.name || "",
        link_undangan: agenda?.linkUndangan || ""
      };

      // For Google Apps Script POST:
      // We use 'text/plain' to avoid CORS preflight (OPTIONS)
      // We use 'no-cors' because GAS redirects (302) which browsers block in standard CORS mode
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      // With no-cors, we can't check response.ok, so we assume success if no error is thrown
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: '#1e3a8a'
      });
      
      // Refresh after a short delay to give GAS time to process
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error saving agenda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan data',
        confirmButtonColor: '#1e3a8a'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                {agenda ? <Edit size={24} strokeWidth={2.5} /> : <Calendar size={24} strokeWidth={2.5} />}
              </div>
              <h2 className="text-xl font-black text-blue-900 tracking-tight uppercase">{agenda ? 'Edit Agenda' : 'Agenda Baru'}</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {/* Nama Kegiatan */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Nama Kegiatan</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nama Agenda..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900/20 transition-all"
                />
              </div>
            </div>

            {/* Penyelenggara */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Penyelenggara</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Instansi / Penyelenggara..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900/20 transition-all"
                />
              </div>
            </div>

            {/* Tanggal, Waktu & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Tanggal</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Waktu</label>
                <div className="relative flex items-center">
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all appearance-none"
                  />
                  <Clock size={18} className="absolute right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Status</label>
                <div className="relative flex items-center">
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'HADIR' | 'DI DISPOSISI')}
                    className={`w-full border rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-900/5 ${
                      status === 'HADIR' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-orange-50 border-orange-100 text-orange-700'
                    }`}
                  >
                    <option value="HADIR">HADIR</option>
                    <option value="DI DISPOSISI">DISPOSISI</option>
                  </select>
                  <ChevronDown size={14} className={`absolute right-4 pointer-events-none ${status === 'HADIR' ? 'text-emerald-400' : 'text-orange-400'}`} />
                </div>
              </div>
            </div>

            {/* Lokasi & Pakaian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Lokasi</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tempat Kegiatan..." 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                  />
                  <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Pakaian</label>
                <div className="relative flex items-center">
                  <select 
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Pilih Pakaian...</option>
                    <option value="PDH">Pdh</option>
                    <option value="PUTIH">Putih</option>
                    <option value="BATIK">Batik</option>
                    <option value="KORPRI">Korpri</option>
                    <option value="BEBAS RAPI">Bebas Rapi</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Keterangan</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan tambahan agenda..." 
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all resize-none"
              />
            </div>

            {/* Disposisi Ke */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Disposisi Ke</label>
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-3xl p-4 space-y-3">
                {disposisiOptions.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedDisposisi.includes(opt)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDisposisi([...selectedDisposisi, opt]);
                          } else {
                            setSelectedDisposisi(selectedDisposisi.filter(item => item !== opt));
                          }
                        }}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all" 
                      />
                      <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-900/70 uppercase tracking-tight group-hover:text-blue-900 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload Undangan */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Upload Undangan</label>
              <label className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                  {file ? <Check size={20} className="text-emerald-500" /> : <FileText size={20} />}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                    {file ? file.name : 'Pilih File Undangan'}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">PDF, JPG, atau PNG (Maks. 5MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 bg-gray-50/50">
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Upload size={20} />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AgendaDetailModal = ({ isOpen, onClose, agenda, onEdit }: { isOpen: boolean, onClose: () => void, agenda: AgendaItem | null, onEdit: (a: AgendaItem) => void }) => {
  if (!isOpen || !agenda) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      // If it's already a long formatted string (e.g. "Kamis, 19 Februari 2026")
      if (dateStr.includes(',') && dateStr.length > 10) return dateStr;
      
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      return d.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Asia/Makassar'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr === '--.--') return '--.--';
    if (timeStr.includes('WITA')) return timeStr;
    
    if (timeStr.includes('T')) {
      try {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false,
            timeZone: 'Asia/Makassar' 
          }).replace(/\./g, ':') + ' WITA';
        }
      } catch (e) {}
    }
    
    return `${timeStr} WITA`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-blue-900/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                agenda.status === 'HADIR' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
              }`}>
                <FileText size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-black text-blue-900 tracking-tight uppercase leading-none">Detail Agenda</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{agenda.id} • {agenda.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(agenda)}
                className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"
                title="Edit Agenda"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {/* Title Section */}
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                agenda.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {agenda.status}
              </span>
              <h3 className="text-2xl lg:text-3xl font-black text-blue-900 leading-tight">
                {agenda.title}
              </h3>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Waktu & Tanggal</p>
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <Clock size={16} className="text-blue-600" />
                  <span>{formatTime(agenda.time)} • {formatDate(agenda.date)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Lokasi</p>
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <MapPin size={16} className="text-blue-600" />
                  <span>{agenda.location || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Pakaian</p>
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <User size={16} className="text-blue-600" />
                  <span>{agenda.dressCode || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Penyelenggara</p>
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                  <FileText size={16} className="text-blue-600" />
                  <span>{agenda.organizer || '-'}</span>
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Keterangan</p>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {agenda.notes || 'Tidak ada keterangan tambahan.'}
                </p>
              </div>
            </div>

            {/* Disposisi (If any) */}
            {agenda.disposisiTo && agenda.disposisiTo.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">Disposisi Ke</p>
                <div className="flex flex-wrap gap-2">
                  {agenda.disposisiTo.map((target, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border border-blue-100">
                      {target}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Invitation Preview */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">File Undangan</p>
              <div 
                onClick={() => agenda.linkUndangan && window.open(agenda.linkUndangan, '_blank')}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 flex items-center justify-center relative">
                  {agenda.linkUndangan ? (
                    <img 
                      src={agenda.linkUndangan.includes('drive.google.com') 
                        ? `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop` // Modern abstract tech background
                        : agenda.linkUndangan
                      } 
                      alt="Undangan" 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileText size={48} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada file</p>
                    </div>
                  )}
                  {agenda.linkUndangan && (
                    <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/40 transition-colors flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600">
                        <ExternalLink size={28} />
                      </div>
                      <p className="text-white font-black text-xs uppercase tracking-widest drop-shadow-md">Klik untuk Membuka</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4">
            <button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Sidebar = ({ currentView, setView, isOpen, user, profile, onLogout }: { currentView: View, setView: (v: View) => void, isOpen: boolean, user: AuthUser | null, profile: UserProfile, onLogout: () => void }) => {
  const navItems = [
    { id: 'Beranda' as View, icon: Home, label: 'Beranda' },
    { id: 'Jadwal' as View, icon: Calendar, label: 'Jadwal' },
    { id: 'Laporan' as View, icon: FileText, label: 'Laporan', adminOnly: true },
  ].filter(item => !item.adminOnly || user?.role === 'ADMIN');

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isOpen ? 256 : 0,
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : -20
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex bg-white border-r border-gray-100 flex-col h-screen sticky top-0 overflow-hidden whitespace-nowrap"
    >
      <div className="p-6 w-64">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
            M
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-gray-900 leading-tight">SI-MACCA</h1>
            <p className="text-xs text-blue-600 font-medium">Drive Integrated</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Kecamatan Ujung Pandang</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 w-64">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-900'
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 w-64">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold border-2 border-white shadow-sm shrink-0">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{profile.name}</p>
            <p className="text-[10px] text-gray-500 truncate uppercase font-bold tracking-tighter">{user?.role || 'GUEST'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const BottomNav = ({ currentView, setView, user }: { currentView: View, setView: (v: View) => void, user: AuthUser | null }) => {
  const navItems = [
    { id: 'Beranda' as View, icon: Home, label: 'Beranda' },
    { id: 'Jadwal' as View, icon: Calendar, label: 'Jadwal' },
    { id: 'Laporan' as View, icon: FileText, label: 'Laporan', adminOnly: true },
  ].filter(item => !item.adminOnly || user?.role === 'ADMIN');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-200 flex-1 ${
            currentView === item.id ? 'text-blue-900' : 'text-gray-400'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-200 ${
            currentView === item.id ? 'bg-blue-50' : ''
          }`}>
            <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-200 ${
            currentView === item.id ? 'opacity-100' : 'opacity-60'
          }`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

const Header = ({ onToggleSidebar, isSidebarOpen, profile, onLogout, onEditProfile, user }: { onToggleSidebar: () => void, isSidebarOpen: boolean, profile: UserProfile, onLogout: () => void, onEditProfile: () => void, user: AuthUser | null }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
          title={isSidebarOpen ? "Sembunyikan Menu" : "Tampilkan Menu"}
        >
          <motion.div
            animate={{ rotate: isSidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={24} className={isSidebarOpen ? "rotate-180" : ""} />
          </motion.div>
        </button>

        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <h1 className="font-bold text-gray-900 text-sm">SI-MACCA</h1>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-80">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari agenda atau laporan..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-600 placeholder:text-gray-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-3 relative">
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl lg:hidden">
          <Search size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-black text-xs lg:text-sm border-2 border-white shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            {profile.initials}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsProfileOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
                >
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-xs font-black text-gray-900 truncate">{profile.name}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter mt-0.5">{profile.title}</p>
                  </div>
                  <div className="p-2">
                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={() => {
                          onEditProfile();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-all"
                      >
                        <User size={16} />
                        Edit Profil
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const BerandaView = ({ setView, onAddAgenda, currentTime, onSelectAgenda, onEditAgenda, agendas, fetchAgendas, isLoading, lastSync, user, profile }: { setView: (v: View) => void, onAddAgenda: () => void, currentTime: Date, onSelectAgenda: (a: AgendaItem) => void, onEditAgenda: (a: AgendaItem) => void, agendas: AgendaItem[], fetchAgendas: () => void, isLoading: boolean, lastSync: Date | null, user: AuthUser | null, profile: UserProfile, key?: string }) => {
  const formattedDate = currentTime.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const todayAgendas = agendas.filter(a => {
    if (!a.rawDate) return false;
    const aDate = new Date(a.rawDate);
    return aDate.toDateString() === currentTime.toDateString();
  });

  const todayAgendasCount = todayAgendas.length;

  const sortedTodayAgendas = [...todayAgendas].sort((a, b) => {
    const timeToMinutes = (t: string) => {
      const part = t.split(' ')[0];
      const [h, m] = part.includes(':') ? part.split(':').map(Number) : part.split('.').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });

  const nextAgenda = sortedTodayAgendas[0] || {
    id: '0',
    time: '--.--',
    title: 'Tidak ada agenda tersisa hari ini',
    status: 'HADIR',
    date: '',
    organizer: '-',
    location: '-'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 lg:space-y-8"
    >
      {/* Hero Section */}
      <section className="bg-blue-900 rounded-[2.5rem] p-6 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/30">
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center gap-6 lg:gap-8">
            <div className="space-y-2">
              <h2 className="text-lg lg:text-xl font-bold opacity-80 tracking-tight">Selamat Datang,</h2>
              <h3 className="text-2xl lg:text-4xl font-black tracking-tighter leading-tight">{profile.name}</h3>
              <p className="text-xs lg:text-sm font-bold text-blue-300 uppercase tracking-widest">{profile.title}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 w-fit mx-auto">
              <p className="text-xs lg:text-sm font-bold tracking-wide opacity-90">{formattedDate}</p>
            </div>
          </div>
          <div className="mt-8 lg:mt-12 flex flex-col items-center gap-4 text-center">
            <div className="bg-emerald-500 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-lg shadow-emerald-500/20">
              <Calendar size={16} />
              {todayAgendasCount} Agenda Hari Ini
            </div>
            <p className="text-blue-200/80 text-xs lg:text-sm font-bold tracking-tight">
              {agendas.length > 0 ? `Agenda terdekat: ${nextAgenda.title}` : 'Semua data sinkron dengan Google Sheets'}
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-700 rounded-full opacity-30 blur-3xl"></div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Next Agenda */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-900">Agenda Berikutnya</h4>
            <button 
              onClick={() => setView('Jadwal')}
              className="text-blue-600 text-sm font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div 
            onClick={() => onSelectAgenda(nextAgenda)}
            className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg text-xs font-bold">{nextAgenda.time}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  nextAgenda.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                }`}>{nextAgenda.status}</span>
              </div>
              <div className="flex gap-2">
                {user?.role === 'ADMIN' && nextAgenda.id !== '0' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAgenda(nextAgenda);
                    }}
                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all duration-200"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                )}
                <button 
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-900 group-hover:text-white transition-all duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <h5 className="text-xl font-bold text-gray-900 leading-snug mb-4 group-hover:text-blue-900 transition-colors">
              {nextAgenda.title}
            </h5>
            <div className="flex items-center gap-3 text-gray-500 text-sm border-t border-gray-50 pt-4">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{nextAgenda.organizer}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>{nextAgenda.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Access & Sync */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Akses Cepat</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={onAddAgenda}
                  className="group bg-white border border-gray-100 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
                >
                  <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                    <FilePlus size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">Tambah Agenda</p>
                    <p className="text-[10px] text-gray-400 leading-tight">Buat jadwal kegiatan baru</p>
                  </div>
                </button>
              )}
              <button 
                onClick={() => setView('Laporan')}
                className={`group bg-white border border-gray-100 rounded-2xl p-3.5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 ${user?.role !== 'ADMIN' ? 'sm:col-span-2' : ''}`}
              >
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <FileText size={22} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">Lihat Laporan</p>
                  <p className="text-[10px] text-gray-400 leading-tight">Cek rekapitulasi agenda</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sync Section */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                <Cloud size={20} className={isLoading ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Sinkronisasi Data</p>
                {lastSync && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    Update terakhir: {lastSync.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={fetchAgendas}
              disabled={isLoading}
              className="w-full sm:w-auto h-11 px-6 bg-blue-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-900/10"
            >
              {isLoading ? 'Sinkron...' : 'Sinkronkan Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const JadwalView = ({ currentTime, onSelectAgenda, onEditAgenda, agendas, fetchAgendas, isLoading, user }: { currentTime: Date, onSelectAgenda: (a: AgendaItem) => void, onEditAgenda: (a: AgendaItem) => void, agendas: AgendaItem[], fetchAgendas: () => void, isLoading: boolean, user: AuthUser | null }) => {
  const [filter, setFilter] = useState<string>('SEMUA');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentTime));
  const activeDateRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [selectedDate]);
  
  const currentMonth = selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const selectedFormatted = selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  const disposisiOptions = DISPOSISI_OPTIONS;

  // Generate dates for the current week centered around selectedDate
  const getWeekDates = (date: Date) => {
    const week = [];
    const start = new Date(date);
    // Find Monday of the week containing the date
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push({
        day: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        date: d.getDate().toString(),
        fullDate: new Date(d),
        active: d.toDateString() === selectedDate.toDateString()
      });
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const filteredAgendas = agendas.filter(a => {
    // Filter by date
    const aDate = new Date(a.rawDate);
    const isSameDate = aDate.toDateString() === selectedDate.toDateString();
    
    // Filter by disposisi
    const matchesDisposisi = filter === 'SEMUA' || a.disposisiTo?.includes(filter);
    
    return isSameDate && matchesDisposisi;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 lg:space-y-8"
    >
      {/* Date Strip */}
      <div className="bg-white border border-gray-100 rounded-3xl lg:rounded-[2rem] p-4 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-2">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{currentMonth}</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              className="p-1 text-gray-400 hover:text-blue-900 transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              className="p-1 text-gray-400 hover:text-blue-900 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex justify-between items-center min-w-max gap-3 lg:gap-4 px-2">
            {weekDates.map((d, i) => (
              <button 
                key={i}
                ref={d.active ? activeDateRef : null}
                onClick={() => setSelectedDate(d.fullDate)}
                className={`flex flex-col items-center justify-center w-14 lg:w-16 h-16 lg:h-20 rounded-2xl transition-all duration-200 ${
                  d.active 
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30 scale-105' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-wider mb-1">{d.day}</span>
                <span className="text-lg lg:text-xl font-extrabold">{d.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda List */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 px-2">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <h4 className="text-lg font-bold text-gray-900 shrink-0">
                {selectedDate.toDateString() === new Date().toDateString() ? 'Agenda Hari Ini' : `Agenda ${selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
              </h4>
              <button 
                onClick={fetchAgendas}
                disabled={isLoading}
                className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-50"
                title="Segarkan Data"
              >
                <Cloud size={16} className={isLoading ? 'animate-pulse' : ''} />
              </button>
            </div>
            <div className="relative group max-w-full">
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-sm cursor-pointer hover:border-blue-200 transition-all overflow-hidden">
                <Filter size={14} className="text-blue-600 shrink-0" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-[9px] sm:text-[10px] font-black text-blue-900 uppercase tracking-widest bg-transparent outline-none appearance-none cursor-pointer pr-5 max-w-[110px] xs:max-w-[160px] sm:max-w-none"
                >
                  <option value="SEMUA">SEMUA DISPOSISI</option>
                  {disposisiOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-1.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center gap-2 text-xs lg:text-sm text-gray-500 py-1">
            <Calendar size={14} />
            <span className="text-center">{selectedFormatted}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-blue-600">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">Mengambil Data...</p>
            </div>
          ) : filteredAgendas.length > 0 ? filteredAgendas.map((agenda) => (
            <motion.div 
              key={agenda.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelectAgenda(agenda)}
              className="bg-white border border-gray-100 rounded-3xl lg:rounded-[2rem] p-5 lg:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 group cursor-pointer"
            >
              <div className="flex sm:flex-col items-center justify-center min-w-[80px] sm:border-r border-gray-50 sm:pr-6 gap-2 sm:gap-0">
                <p className="text-sm font-black text-blue-900">{agenda.time.split(' ')[0]}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">WITA</p>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    agenda.status === 'HADIR' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {agenda.status}
                  </span>
                </div>
                <h5 className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors leading-snug">
                  {agenda.title}
                </h5>
              </div>

              <div className="flex items-center gap-2">
                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAgenda(agenda);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <Edit size={14} />
                    EDIT
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgenda(agenda);
                  }}
                  className="flex items-center justify-center gap-2 bg-gray-50 text-gray-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all duration-200 shadow-sm"
                >
                  <FileText size={14} />
                  INFO
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-gray-400">
              <Filter size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-bold text-sm">Tidak ada agenda untuk disposisi ini</p>
              <button 
                onClick={() => setFilter('SEMUA')}
                className="mt-2 text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LaporanView = ({ setView, agendas }: { setView: (v: View) => void, agendas: AgendaItem[] }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const validateRange = () => {
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal awal dan akhir.');
      return false;
    }
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (end < start) {
      setError('Tanggal akhir tidak boleh sebelum tanggal awal.');
      return false;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 31) {
      setError('Maksimal rentang laporan adalah 31 hari.');
      return false;
    }

    setError('');
    return true;
  };

  const handleGenerate = async () => {
    if (!validateRange()) return;

    setIsGenerating(true);
    try {
      // Filter data locally from agendas prop
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredData = agendas.filter(item => {
        if (!item.rawDate) return false;
        const itemDate = new Date(item.rawDate);
        return !isNaN(itemDate.getTime()) && itemDate >= start && itemDate <= end;
      });

      if (filteredData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Data Kosong',
          text: 'Tidak ada agenda ditemukan pada rentang tanggal tersebut.',
          confirmButtonColor: '#1e3a8a'
        });
        setIsGenerating(false);
        return;
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Helper for Indonesian Day Name
      const getIndoDay = (dateStr: string) => {
        const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
        const d = new Date(dateStr);
        return !isNaN(d.getTime()) ? days[d.getDay()] : '-';
      };

      // Helper for Indonesian Month Name
      const getIndoMonth = (dateStr: string) => {
        const months = [
          'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
          'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
        ];
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };

      // Group data by date (using YYYY-MM-DD for consistent grouping)
      const groupedData: { [key: string]: any[] } = {};
      filteredData.forEach(item => {
        const d = new Date(item.rawDate);
        if (isNaN(d.getTime())) return;
        const dateKey = d.toISOString().split('T')[0];
        if (!groupedData[dateKey]) groupedData[dateKey] = [];
        groupedData[dateKey].push(item);
      });

      const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      sortedDates.forEach((dateKey, index) => {
        if (index > 0) doc.addPage();

        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Header Logos
        // Note: jsPDF requires base64 or direct image URLs. Since these are external URLs that might have CORS issues,
        // we use a proxy or direct URL if they allow cross-origin.
        // For reliability in this environment, we'll try to add them directly.
        try {
          doc.addImage('https://iili.io/q3KBl4V.png', 'PNG', 15, 10, 20, 25); // Logo Kota Makassar (Left)
          doc.addImage('https://iili.io/q3KB5hb.png', 'PNG', pageWidth - 35, 10, 20, 25); // Logo Kecamatan (Right)
        } catch (e) {
          console.warn('Could not load images for PDF', e);
          doc.setFontSize(8);
          doc.text("[LOGO KOTA]", 20, 20);
          doc.text("[LOGO KECAMATAN]", pageWidth - 45, 20);
        }

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        const title = "RENCANA KEGIATAN KECAMATAN UJUNG PANDANG";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, 25);
        doc.line((pageWidth - titleWidth) / 2, 26, (pageWidth + titleWidth) / 2, 26);

        // Metadata
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`HARI`, pageWidth / 2 - 30, 35);
        doc.text(`TANGGAL`, pageWidth / 2 - 30, 40);
        
        doc.setFont("helvetica", "normal");
        doc.text(`: ${getIndoDay(dateKey)}`, pageWidth / 2 - 10, 35);
        doc.text(`: ${getIndoMonth(dateKey)}`, pageWidth / 2 - 10, 40);

        // Table
        const tableData = groupedData[dateKey].map((item, i) => [
          i + 1,
          item.time ? item.time.split(' ')[0] : '-',
          item.title || '-',
          item.location || '-',
          item.dressCode || '-',
          item.disposisiTo ? item.disposisiTo.join(', ') : '-',
          'CAMAT', 
          item.status || '-',
          '' 
        ]);

        autoTable(doc, {
          startY: 45,
          head: [['NO.', 'WAKTU', 'KEGIATAN', 'TEMPAT/LOKASI', 'PAKAIAN', 'PEJABAT PENDAMPING/PEJABAT YANG MEWAKILI', 'PEJABAT', 'KETERANGAN', 'HUMAS']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: 'center',
            valign: 'middle',
            fontSize: 8,
            fontStyle: 'bold'
          },
          styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            fontSize: 8,
            textColor: [0, 0, 0],
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 15, halign: 'center' },
            2: { cellWidth: 60 },
            3: { cellWidth: 40 },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 45 },
            6: { cellWidth: 20, halign: 'center' },
            7: { cellWidth: 30, halign: 'center' },
            8: { cellWidth: 15 }
          }
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        if (finalY + 40 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          // Reset Y for new page
          doc.text("MENGETAHUI,", 20, 20);
          doc.text("SEKRETARIS CAMAT", 20, 25);
          
          doc.setFont("helvetica", "bold");
          doc.text("FIRMAN JAMALUDDIN, S.STP", 20, 55);
          doc.line(20, 56, 70, 56);
          doc.setFont("helvetica", "normal");
          doc.text("19820103 200112 1 003", 20, 60);
          doc.text("Penata TK I - IIId", 20, 65);
        } else {
          doc.text("MENGETAHUI,", 20, finalY);
          doc.text("SEKRETARIS CAMAT", 20, finalY + 5);
          
          doc.setFont("helvetica", "bold");
          doc.text("FIRMAN JAMALUDDIN, S.STP", 20, finalY + 35);
          doc.line(20, finalY + 36, 70, finalY + 36);
          doc.setFont("helvetica", "normal");
          doc.text("19820103 200112 1 003", 20, finalY + 40);
          doc.text("Penata TK I - IIId", 20, finalY + 45);
        }
      });

      doc.save(`Laporan_Agenda_${startDate}_sd_${endDate}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Laporan PDF telah diunduh.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat membuat laporan.',
        confirmButtonColor: '#1e3a8a'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-blue-900 tracking-tight uppercase">Laporan Agenda</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Rekapitulasi jadwal pimpinan dalam rentang waktu tertentu</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
          <CalendarRange size={18} className="text-blue-600" />
          <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Maks. 31 Hari</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Tanggal Awal</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Tanggal Akhir</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
            />
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-bold text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            {error}
          </motion.p>
        )}

        <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex-1 w-full sm:w-auto bg-blue-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                <Download size={18} />
                Cetak Laporan (PDF)
              </>
            )}
          </button>
          <button 
            className="flex-1 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <FileText size={18} />
            Export ke Excel
          </button>
        </div>
      </div>

      <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Petunjuk Laporan</h4>
            <ul className="mt-2 space-y-2">
              <li className="text-xs text-blue-800/70 font-medium flex items-center gap-2">
                <ArrowRight size={12} />
                Pilih rentang tanggal yang diinginkan (Maks. 31 hari).
              </li>
              <li className="text-xs text-blue-800/70 font-medium flex items-center gap-2">
                <ArrowRight size={12} />
                Laporan akan mencakup semua agenda (Hadir & Disposisi).
              </li>
              <li className="text-xs text-blue-800/70 font-medium flex items-center gap-2">
                <ArrowRight size={12} />
                Data diambil langsung dari sinkronisasi Google Drive.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('Login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nanin Sudiar, A.P.',
    title: 'Camat Ujung Pandang',
    initials: 'NS'
  });
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleLogin = (u: string, p: string) => {
    if (u === 'admin' && p === 'samiun15') {
      setUser({ username: u, role: 'ADMIN' });
      setView('Beranda');
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang, Admin!',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Username atau password salah.'
      });
    }
  };

  const handleGuestAccess = () => {
    setUser({ username: 'guest', role: 'GUEST' });
    setView('Beranda');
  };

  const handleLogout = () => {
    setUser(null);
    setView('Login');
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    Swal.fire({
      icon: 'success',
      title: 'Profil Diperbarui',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const fetchAgendas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const mappedData: AgendaItem[] = data
          .filter(item => item !== null && typeof item === 'object')
          .map((item: any) => {
            const rawTime = String(item.waktu || '--.--');
            let timeValue = rawTime;
            if (rawTime.includes('T')) {
              const d = new Date(rawTime);
              if (!isNaN(d.getTime())) {
                timeValue = d.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false,
                  timeZone: 'Asia/Makassar' 
                }).replace(/\./g, ':') + ' WITA';
              }
            }
            
            const rawDate = String(item.tanggal || '');
            let dateValue = rawDate;
            if (rawDate.includes('T')) {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                dateValue = d.toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long',
                  timeZone: 'Asia/Makassar'
                });
              }
            }

            return {
              id: String(item.id || Math.random()),
              time: timeValue,
              title: String(item.nama_kegiatan || 'Tanpa Judul'),
              status: (String(item.status).toUpperCase().includes('DISPOSISI') ? 'DI DISPOSISI' : 'HADIR') as 'HADIR' | 'DI DISPOSISI',
              date: dateValue,
              rawDate: rawDate,
              location: String(item.lokasi || ''),
              dressCode: String(item.pakaian || ''),
              notes: String(item.keterangan || ''),
              organizer: String(item.penyelenggara || ''),
              disposisiTo: item.disposisi_ke ? String(item.disposisi_ke).split(', ') : [],
              linkUndangan: String(item.link_undangan || '')
            };
          });
        setAgendas(mappedData);
        setLastSync(new Date());
      }
    } catch (error) {
      console.error('Error fetching agendas:', error);
      // No fallback to mock data to ensure user only sees real data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
    // Auto sync every 60 seconds
    const syncInterval = setInterval(fetchAgendas, 60000);
    return () => clearInterval(syncInterval);
  }, []);

  const handleSelectAgenda = (agenda: AgendaItem) => {
    setSelectedAgenda(agenda);
    setIsDetailModalOpen(true);
  };

  const handleEditAgenda = (agenda: AgendaItem) => {
    if (user?.role !== 'ADMIN') return;
    setSelectedAgenda(agenda);
    setIsDetailModalOpen(false);
    setIsAgendaModalOpen(true);
  };

  const handleAddAgenda = () => {
    if (user?.role !== 'ADMIN') return;
    setSelectedAgenda(null);
    setIsAgendaModalOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (view === 'Login') {
    return <LoginView onLogin={handleLogin} onGuestAccess={handleGuestAccess} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 pb-20 lg:pb-0">
      {/* Sidebar (Desktop) */}
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        user={user} 
        profile={profile} 
        onLogout={handleLogout} 
      />

      {/* Bottom Nav (Mobile) */}
      <BottomNav currentView={view} setView={setView} user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
          profile={profile}
          onLogout={handleLogout}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          user={user}
        />
        
        <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {view === 'Beranda' && (
              <BerandaView 
                key="beranda" 
                setView={setView} 
                onAddAgenda={handleAddAgenda} 
                currentTime={currentTime} 
                onSelectAgenda={handleSelectAgenda}
                onEditAgenda={handleEditAgenda}
                agendas={agendas}
                fetchAgendas={fetchAgendas}
                isLoading={isLoading}
                lastSync={lastSync}
                user={user}
                profile={profile}
              />
            )}
            {view === 'Jadwal' && (
              <JadwalView 
                currentTime={currentTime} 
                onSelectAgenda={handleSelectAgenda}
                onEditAgenda={handleEditAgenda}
                agendas={agendas}
                fetchAgendas={fetchAgendas}
                isLoading={isLoading}
                user={user}
              />
            )}
            {view === 'Laporan' && (
              <LaporanView setView={setView} agendas={agendas} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Button (Admin Only) */}
      {user?.role === 'ADMIN' && view !== 'Laporan' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddAgenda}
          className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 w-14 h-14 bg-blue-900 text-white rounded-2xl shadow-2xl shadow-blue-900/40 flex items-center justify-center z-40 lg:z-50"
        >
          <Plus size={28} strokeWidth={3} />
        </motion.button>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
      />

      {/* Agenda Modal */}
      <AgendaModal 
        isOpen={isAgendaModalOpen} 
        onClose={() => setIsAgendaModalOpen(false)} 
        agenda={selectedAgenda}
        onRefresh={fetchAgendas}
      />

      {/* Detail Modal */}
      <AgendaDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        agenda={selectedAgenda} 
        onEdit={handleEditAgenda}
      />

      {/* Custom Styles for no-scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
