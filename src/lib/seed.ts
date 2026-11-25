import { store } from './store';
import { today } from './format';

// Adds clearly-labelled sample records once, so a new system is not empty.
// Owners can delete them at any time.
export async function seedSampleData() {
  const meta = await store.list('meta');
  if (meta.some((m) => m.id === 'seeded')) return;

  const t = today();
  const note = 'Sample data, delete when ready';
  const p1 = await store.insert('patients', { fullName: 'Sample Patient A', phone: '0700 000 001', gender: 'Female', dateOfBirth: '1984-03-12', bloodGroup: 'O+', allergies: 'None known', notes: note });
  const p2 = await store.insert('patients', { fullName: 'Sample Patient B', phone: '0700 000 002', gender: 'Male', dateOfBirth: '1990-08-21', bloodGroup: 'A+', allergies: 'Penicillin', notes: note });
  await store.insert('patients', { fullName: 'Sample Patient C', phone: '0700 000 003', gender: 'Female', dateOfBirth: '2001-11-02', bloodGroup: 'B+', allergies: '', notes: note });

  await store.insert('appointments', { patientName: p1.fullName, doctor: 'Dr. Sample', date: `${t}T09:30`, reason: 'Follow-up', status: 'Scheduled', fee: 500, paymentStatus: 'Paid' });
  await store.insert('appointments', { patientName: p2.fullName, doctor: 'Dr. Sample', date: `${t}T11:00`, reason: 'New complaint', status: 'Checked in', fee: 800, paymentStatus: 'Paid' });
  await store.insert('appointments', { patientName: 'Sample Patient C', doctor: 'Dr. Sample', date: `${t}T14:15`, reason: 'Vaccination', status: 'Scheduled', fee: 300, paymentStatus: 'Unpaid' });

  await store.insert('consultations', { patientName: p1.fullName, doctor: 'Dr. Sample', date: t, complaint: 'Headache for three days', diagnosis: 'Tension headache', prescription: 'Paracetamol 500 mg, twice daily for 3 days', followUpDate: '', notes: note });

  await store.insert('inventory', { name: 'Paracetamol 500 mg', category: 'Medicine', quantity: 240, unit: 'tablets', reorderLevel: 100, unitPrice: 4, expiryDate: '2028-06-30' });
  await store.insert('inventory', { name: 'Amoxicillin 250 mg', category: 'Medicine', quantity: 12, unit: 'capsules', reorderLevel: 40, unitPrice: 12, expiryDate: '2027-02-28' });
  await store.insert('inventory', { name: 'Disposable syringes 5 ml', category: 'Consumable', quantity: 300, unit: 'pcs', reorderLevel: 100, unitPrice: 9, expiryDate: '2029-01-31' });

  await store.insert('dispensing', { patientName: p1.fullName, items: 'Paracetamol 500 mg x 10', amount: 40, paymentMethod: 'Cash', paymentStatus: 'Paid', date: t });
  await store.insert('dispensing', { patientName: p2.fullName, items: 'Amoxicillin 250 mg x 14', amount: 168, paymentMethod: 'Card', paymentStatus: 'Partly paid', date: t });

  await store.insert('accounting', { type: 'Income', category: 'Consultation fee', description: 'Sample consultation fees', amount: 1300, paymentMethod: 'Cash', date: t });
  await store.insert('accounting', { type: 'Income', category: 'Pharmacy sales', description: 'Sample dispensing', amount: 208, paymentMethod: 'Cash', date: t });
  await store.insert('accounting', { type: 'Expense', category: 'Utilities', description: 'Sample electricity bill', amount: 2500, paymentMethod: 'Mobile transfer', date: t });
  await store.insert('accounting', { type: 'Expense', category: 'Medical supplies', description: 'Sample supplies order', amount: 3600, paymentMethod: 'Cash', date: t });

  await store.insert('staff', { fullName: 'Sample Doctor', role: 'Doctor', phone: '0700 000 010', shift: 'Morning' });
  await store.insert('staff', { fullName: 'Sample Receptionist', role: 'Receptionist', phone: '0700 000 011', shift: 'Full day' });

  await store.put('meta', 'seeded', { value: true });
}
