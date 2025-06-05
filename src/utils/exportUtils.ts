import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PP');
  } catch (error) {
    return 'N/A';
  }
};

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPpp');
  } catch (error) {
    return 'N/A';
  }
};

export const exportHealthReport = (patientData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.text('MediBloom Health Report', pageWidth / 2, 20, { align: 'center' });
  
  // Add patient info
  doc.setFontSize(12);
  doc.text(`Patient Name: ${patientData.full_name}`, 20, 40);
  doc.text(`Date of Birth: ${formatDate(patientData.date_of_birth)}`, 20, 50);
  doc.text(`Report Generated: ${formatDateTime(new Date().toISOString())}`, 20, 60);

  // Add vitals
  doc.setFontSize(14);
  doc.text('Vital Signs', 20, 80);
  doc.autoTable({
    startY: 85,
    head: [['Date', 'Blood Pressure', 'Heart Rate', 'Temperature']],
    body: (patientData.vitals || []).map((vital: any) => [
      formatDateTime(vital.recorded_at),
      `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`,
      `${vital.heart_rate} bpm`,
      `${vital.temperature}°F`
    ]),
  });

  // Add medications
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.text('Current Medications', 20, finalY + 20);
  doc.autoTable({
    startY: finalY + 25,
    head: [['Medication', 'Dosage', 'Frequency', 'Start Date']],
    body: (patientData.medications || []).map((med: any) => [
      med.name,
      med.dosage,
      med.frequency,
      formatDate(med.start_date)
    ]),
  });

  // Save the PDF
  doc.save(`health_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};