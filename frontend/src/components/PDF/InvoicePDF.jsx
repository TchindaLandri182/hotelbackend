import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer'

// Register fonts for better text rendering
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
// })

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    // fontFamily: 'Roboto'
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10

  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
    textAlign: 'center',
  },
  hotelInfo: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1f2937'
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  invoiceDetails: {
    fontSize: 12,
    marginBottom: 2
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#e5e7eb'
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '14.28%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 8
  },
  tableCol: {
    width: '14.28%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    padding: 8
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151'
  },
  tableCell: {
    fontSize: 10,
    color: '#6b7280'
  },
  totalRow: {
    backgroundColor: '#f3f4f6'
  },
  totalCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e5e7eb'
  },
  amountInWords: {
    fontSize: 12,
    marginBottom: 20,
    fontStyle: 'italic'
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  },
  signatureBox: {
    width: '40%',
    textAlign: 'center'
  },
  signatureLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 30
  },
  signatureLine: {
    borderBottom: 1,
    borderBottomColor: '#000000',
    marginBottom: 5
  },
  bilingual: {
    fontSize: 8,
    color: '#9ca3af',
    fontStyle: 'italic'
  }
})

const InvoicePDF = ({ invoice, hotel, language = 'fr' }) => {
  const isEnglish = language === 'en'
  // const invoice = invoice || {
  //     _id: '1',
  //     stay: {
  //       _id: '1',
  //       client: { firstName: 'John', lastName: 'Smith' },
  //       room: { roomNumber: '101' },
  //       startDate: '2024-01-15T00:00:00Z',
  //       endDate: '2024-01-20T00:00:00Z'
  //     },
  //     totalAmount: 500,
  //     issueDate: '2024-01-20T00:00:00Z',
  //     paymentStatus: 'paid',
  //     payments: [
  //       { amountPaid: 500, datePaid: '2024-01-20T00:00:00Z', method: 'card' }
  //     ],
  //     createdAt: '2024-01-20T10:30:00Z'
  //   }

  // const hotel = hotel || {
  //     name: invoice.stay.room.hotel?.name || 'Hotel Name',
  //     address: invoice.stay.room.hotel?.address || 'Hotel Address',
  //     phone: '+1 (555) 123-4567',
  //     email: 'contact@hotel.com'
  //   }
  
  const translations = {
    fr: {
      invoice: 'FACTURE',
      invoiceNumber: 'Numéro de facture',
      issueDate: 'Date d\'émission',
      guestInfo: 'Informations du client',
      guest: 'Client',
      room: 'Chambre',
      category: 'Catégorie',
      checkIn: 'Arrivée',
      checkOut: 'Départ',
      nights: 'Nuits',
      nightPrice: 'Prix/Nuit',
      amount: 'Montant',
      total: 'TOTAL',
      amountInWords: 'Montant en lettres',
      clientSignature: 'Signature du client',
      hotelSignature: 'Signature de l\'hôtel',
      date: 'Date'
    },
    en: {
      invoice: 'INVOICE',
      invoiceNumber: 'Invoice Number',
      issueDate: 'Issue Date',
      guestInfo: 'Guest Information',
      guest: 'Guest',
      room: 'Room',
      category: 'Category',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      nights: 'Nights',
      nightPrice: 'Price/Night',
      amount: 'Amount',
      total: 'TOTAL',
      amountInWords: 'Amount in words',
      clientSignature: 'Client Signature',
      hotelSignature: 'Hotel Signature',
      date: 'Date'
    }
  }

  const t = translations[language]

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const numberToWords = (num) => {
    if (language === 'en') {
      // English number to words (simplified)
      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
      const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
      
      if (num < 10) return ones[num]
      if (num < 20) return teens[num - 10]
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
      if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '')
      
      return num.toString() + ' dollars'
    } else {
      // French number to words (simplified)
      const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
      const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix']
      
      if (num < 10) return ones[num]
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
      
      return num.toString() + ' FCFA'
    }
  }

  const nights = calculateNights(invoice.stay.startDate, invoice.stay.endDate)
  const nightPrice = invoice.stay.room.category?.basePrice || 0
  const roomAmount = nights * nightPrice

  // Calculate order items total if present
  const orderItemsTotal = invoice.orderItems?.reduce((total, item) => {
    return total + (item.quantity * item.foodItem.price)
  }, 0) || 0

  const totalAmount = roomAmount + orderItemsTotal

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelInfo}>{hotel.address}</Text>
          <Text style={styles.hotelInfo}>
            {isEnglish ? 'Phone: ' : 'Téléphone: '}{hotel.phone || 'N/A'}
          </Text>
          <Text style={styles.hotelInfo}>
            {isEnglish ? 'Email: ' : 'Email: '}{hotel.email || 'N/A'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {t.invoice} / {translations[isEnglish ? 'fr' : 'en'].invoice}
        </Text>

        {/* Invoice Information */}
        <View style={styles.invoiceInfo}>
          <View>
            <Text style={styles.invoiceDetails}>
              {t.invoiceNumber}: INV-{invoice._id.slice(-6).toUpperCase()}
            </Text>
            <Text style={styles.invoiceDetails}>
              {t.issueDate}: {new Date(invoice.issueDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceDetails}>
              {t.guest}: {invoice.stay.client.firstName} {invoice.stay.client.lastName}
            </Text>
            <Text style={styles.invoiceDetails}>
              {t.room}: {invoice.stay.room.roomNumber}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.category}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.category : translations.en.category}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.room}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.room : translations.en.room}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.checkIn}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.checkIn : translations.en.checkIn}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.checkOut}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.checkOut : translations.en.checkOut}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.nights}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.nights : translations.en.nights}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.nightPrice}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.nightPrice : translations.en.nightPrice}
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{t.amount}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.amount : translations.en.amount}
              </Text>
            </View>
          </View>

          {/* Room Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {language === 'fr' ? invoice.stay.room.category?.name?.fr : invoice.stay.room.category?.name?.en}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{invoice.stay.room.roomNumber}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(invoice.stay.startDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(invoice.stay.endDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{nights}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{nightPrice} FCFA</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{roomAmount} FCFA</Text>
            </View>
          </View>

          {/* Order Items Rows */}
          {invoice.orderItems?.map((orderItem, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {language === 'fr' ? 'Service de restauration' : 'Food Service'}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {language === 'fr' ? orderItem.foodItem.name?.fr : orderItem.foodItem.name?.en}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(orderItem.orderDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>-</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{orderItem.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{orderItem.foodItem.price} FCFA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{orderItem.quantity * orderItem.foodItem.price} FCFA</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <View style={[styles.tableCol, { width: '85.72%' }]}>
              <Text style={styles.totalCell}>{t.total}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.totalCell}>{totalAmount} FCFA</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.amountInWords}>
            {t.amountInWords}: {numberToWords(totalAmount)}
          </Text>
          <Text style={styles.bilingual}>
            {isEnglish ? translations.fr.amountInWords : translations.en.amountInWords}: {numberToWords(totalAmount)}
          </Text>

          <View style={styles.signature}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>{t.clientSignature}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.clientSignature : translations.en.clientSignature}
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>{t.date}: _______________</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>{t.hotelSignature}</Text>
              <Text style={styles.bilingual}>
                {isEnglish ? translations.fr.hotelSignature : translations.en.hotelSignature}
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>{t.date}: _______________</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePDF

// import React from 'react'
// import { Document, Page, Text, View, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer'

// // Register fonts for better text rendering
// // Font.register({
// //   family: 'Roboto',
// //   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
// // })
// const registerFonts = async () => {
//   try {
//     // Try to register Roboto from CDN
//     await Font.register({
//       family: 'Roboto',
//       src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.woff2',
//     });
    
//     console.log('Roboto font registered successfully');
//   } catch (error) {
//     console.warn('Failed to register Roboto font, using fallback:', error);
    
//     // Register fallback fonts
//     Font.register({
//       family: 'Helvetica',
//     });
    
//     Font.register({
//       family: 'Times-Roman',
//     });
//   }
// };

// // Call font registration
// registerFonts().catch(console.error);

// const fontFamily = 'Roboto, Helvetica, Times-Roman';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     padding: 30,
//     fontFamily: fontFamily
//   },
//   header: {
//     marginBottom: 20,
//     borderBottom: 2,
//     borderBottomColor: '#2563eb',
//     paddingBottom: 10
//   },
//   hotelName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2563eb',
//     marginBottom: 5
//   },
//   hotelInfo: {
//     fontSize: 12,
//     color: '#666666',
//     marginBottom: 2
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#1f2937'
//   },
//   invoiceInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20
//   },
//   invoiceDetails: {
//     fontSize: 12,
//     marginBottom: 2
//   },
//   table: {
//     display: 'table',
//     width: 'auto',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//     borderColor: '#e5e7eb'
//   },
//   tableRow: {
//     margin: 'auto',
//     flexDirection: 'row'
//   },
//   tableColHeader: {
//     width: '14.28%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#f9fafb',
//     padding: 8
//   },
//   tableCol: {
//     width: '14.28%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     borderColor: '#e5e7eb',
//     padding: 8
//   },
//   tableCellHeader: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#374151'
//   },
//   tableCell: {
//     fontSize: 10,
//     color: '#6b7280'
//   },
//   totalRow: {
//     backgroundColor: '#f3f4f6'
//   },
//   totalCell: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#1f2937'
//   },
//   footer: {
//     marginTop: 30,
//     paddingTop: 20,
//     borderTop: 1,
//     borderTopColor: '#e5e7eb'
//   },
//   amountInWords: {
//     fontSize: 12,
//     marginBottom: 20,
//     fontStyle: 'italic'
//   },
//   signature: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 40
//   },
//   signatureBox: {
//     width: '40%',
//     textAlign: 'center'
//   },
//   signatureLabel: {
//     fontSize: 10,
//     color: '#6b7280',
//     marginBottom: 30
//   },
//   signatureLine: {
//     borderBottom: 1,
//     borderBottomColor: '#000000',
//     marginBottom: 5
//   },
//   bilingual: {
//     fontSize: 8,
//     color: '#9ca3af',
//     fontStyle: 'italic'
//   }
// })

// const InvoicePDF = ({ invoice, hotel, language = 'fr' }) => {
//   // Safe default data
//   const safeInvoice = invoice || {
//     _id: '1',
//     stay: {
//       _id: '1',
//       client: { firstName: 'John', lastName: 'Smith' },
//       room: { 
//         roomNumber: '101',
//         category: {
//           name: { en: 'Standard Room', fr: 'Chambre Standard' },
//           basePrice: 100
//         }
//       },
//       startDate: '2024-01-15T00:00:00Z',
//       endDate: '2024-01-20T00:00:00Z'
//     },
//     totalAmount: 500,
//     issueDate: '2024-01-20T00:00:00Z',
//     paymentStatus: 'paid',
//     payments: [
//       { amountPaid: 500, datePaid: '2024-01-20T00:00:00Z', method: 'card' }
//     ],
//     orderItems: [],
//     createdAt: '2024-01-20T10:30:00Z'
//   }

//   const safeHotel = hotel || {
//     name: 'Grand Hotel',
//     address: '123 Main Street, City, Country',
//     phone: '+1 (555) 123-4567',
//     email: 'contact@grandhotel.com'
//   }

//   const isEnglish = language === 'en'

//   const translations = {
//     fr: {
//       invoice: 'FACTURE',
//       invoiceNumber: 'Numéro de facture',
//       issueDate: 'Date d\'émission',
//       guestInfo: 'Informations du client',
//       guest: 'Client',
//       room: 'Chambre',
//       category: 'Catégorie',
//       checkIn: 'Arrivée',
//       checkOut: 'Départ',
//       nights: 'Nuits',
//       nightPrice: 'Prix/Nuit',
//       amount: 'Montant',
//       total: 'TOTAL',
//       amountInWords: 'Montant en lettres',
//       clientSignature: 'Signature du client',
//       hotelSignature: 'Signature de l\'hôtel',
//       date: 'Date'
//     },
//     en: {
//       invoice: 'INVOICE',
//       invoiceNumber: 'Invoice Number',
//       issueDate: 'Issue Date',
//       guestInfo: 'Guest Information',
//       guest: 'Guest',
//       room: 'Room',
//       category: 'Category',
//       checkIn: 'Check-in',
//       checkOut: 'Check-out',
//       nights: 'Nights',
//       nightPrice: 'Price/Night',
//       amount: 'Amount',
//       total: 'TOTAL',
//       amountInWords: 'Amount in words',
//       clientSignature: 'Client Signature',
//       hotelSignature: 'Hotel Signature',
//       date: 'Date'
//     }
//   }

//   const t = translations[language]

//   const calculateNights = (checkIn, checkOut) => {
//     try {
//       const start = new Date(checkIn)
//       const end = new Date(checkOut)
//       const diffTime = Math.abs(end - start)
//       return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     } catch (error) {
//       return 1 // Default to 1 night if date parsing fails
//     }
//   }

//   const numberToWords = (num) => {
//     if (language === 'en') {
//       // English number to words (simplified)
//       const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
//       const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
//       const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
      
//       if (num < 10) return ones[num]
//       if (num < 20) return teens[num - 10]
//       if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
//       if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '')
      
//       return num.toString() + ' dollars'
//     } else {
//       // French number to words (simplified)
//       const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
//       const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix']
      
//       if (num < 10) return ones[num]
//       if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
      
//       return num.toString() + ' francs'
//     }
//   }

//   // Safe property access with defaults
//   const stay = safeInvoice.stay || {}
//   const client = stay.client || { firstName: 'Unknown', lastName: 'Guest' }
//   const room = stay.room || { roomNumber: 'N/A', category: { name: { en: 'Unknown', fr: 'Inconnu' }, basePrice: 0 } }
//   const roomCategory = room.category || { name: { en: 'Unknown', fr: 'Inconnu' }, basePrice: 0 }
  
//   const nights = calculateNights(stay.startDate, stay.endDate)
//   const nightPrice = roomCategory.basePrice || 0
//   const roomAmount = nights * nightPrice

//   // Calculate order items total if present
//   const orderItemsTotal = safeInvoice.orderItems?.reduce((total, item) => {
//     const foodItem = item.foodItem || { price: 0 }
//     return total + ((item.quantity || 0) * foodItem.price)
//   }, 0) || 0

//   const totalAmount = roomAmount + orderItemsTotal

//   return (
//     <PDFViewer>
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.hotelName}>{safeHotel.name}</Text>
//           <Text style={styles.hotelInfo}>{safeHotel.address}</Text>
//           <Text style={styles.hotelInfo}>
//             {isEnglish ? 'Phone: ' : 'Téléphone: '}{safeHotel.phone || 'N/A'}
//           </Text>
//           <Text style={styles.hotelInfo}>
//             {isEnglish ? 'Email: ' : 'Email: '}{safeHotel.email || 'N/A'}
//           </Text>
//         </View>

//         {/* Title */}
//         <Text style={styles.title}>
//           {t.invoice} / {translations[isEnglish ? 'fr' : 'en'].invoice}
//         </Text>

//         {/* Invoice Information */}
//         <View style={styles.invoiceInfo}>
//           <View>
//             <Text style={styles.invoiceDetails}>
//               {t.invoiceNumber}: INV-{(safeInvoice._id || '000001').slice(-6).toUpperCase()}
//             </Text>
//             <Text style={styles.invoiceDetails}>
//               {t.issueDate}: {new Date(safeInvoice.issueDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
//             </Text>
//           </View>
//           <View>
//             <Text style={styles.invoiceDetails}>
//               {t.guest}: {client.firstName} {client.lastName}
//             </Text>
//             <Text style={styles.invoiceDetails}>
//               {t.room}: {room.roomNumber}
//             </Text>
//           </View>
//         </View>

//         {/* Table */}
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableRow}>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.category}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.category : translations.en.category}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.room}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.room : translations.en.room}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.checkIn}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.checkIn : translations.en.checkIn}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.checkOut}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.checkOut : translations.en.checkOut}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.nights}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.nights : translations.en.nights}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.nightPrice}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.nightPrice : translations.en.nightPrice}
//               </Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.tableCellHeader}>{t.amount}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.amount : translations.en.amount}
//               </Text>
//             </View>
//           </View>

//           {/* Room Row */}
//           <View style={styles.tableRow}>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>
//                 {language === 'fr' ? roomCategory.name?.fr : roomCategory.name?.en}
//               </Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{room.roomNumber}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>
//                 {new Date(stay.startDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
//               </Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>
//                 {new Date(stay.endDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
//               </Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{nights}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>${nightPrice}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>${roomAmount}</Text>
//             </View>
//           </View>

//           {/* Order Items Rows */}
//           {safeInvoice.orderItems?.map((orderItem, index) => {
//             const foodItem = orderItem.foodItem || { name: { en: 'Unknown Item', fr: 'Article inconnu' }, price: 0 }
//             return (
//               <View key={index} style={styles.tableRow}>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>
//                     {language === 'fr' ? 'Service de restauration' : 'Food Service'}
//                   </Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>
//                     {language === 'fr' ? foodItem.name?.fr : foodItem.name?.en}
//                   </Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>
//                     {new Date(orderItem.orderDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
//                   </Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>-</Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>{orderItem.quantity || 0}</Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>${foodItem.price}</Text>
//                 </View>
//                 <View style={styles.tableCol}>
//                   <Text style={styles.tableCell}>${(orderItem.quantity || 0) * foodItem.price}</Text>
//                 </View>
//               </View>
//             )
//           })}

//           {/* Total Row */}
//           <View style={[styles.tableRow, styles.totalRow]}>
//             <View style={[styles.tableCol, { width: '71.4%' }]}>
//               <Text style={styles.totalCell}>{t.total}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.totalCell}>${totalAmount}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.amountInWords}>
//             {t.amountInWords}: {numberToWords(totalAmount)}
//           </Text>
//           <Text style={styles.bilingual}>
//             {isEnglish ? translations.fr.amountInWords : translations.en.amountInWords}: {numberToWords(totalAmount)}
//           </Text>

//           <View style={styles.signature}>
//             <View style={styles.signatureBox}>
//               <Text style={styles.signatureLabel}>{t.clientSignature}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.clientSignature : translations.en.clientSignature}
//               </Text>
//               <View style={styles.signatureLine}></View>
//               <Text style={styles.signatureLabel}>{t.date}: _______________</Text>
//             </View>
//             <View style={styles.signatureBox}>
//               <Text style={styles.signatureLabel}>{t.hotelSignature}</Text>
//               <Text style={styles.bilingual}>
//                 {isEnglish ? translations.fr.hotelSignature : translations.en.hotelSignature}
//               </Text>
//               <View style={styles.signatureLine}></View>
//               <Text style={styles.signatureLabel}>{t.date}: _______________</Text>
//             </View>
//           </View>
//         </View>
//       </Page>
//     </Document>
//     </PDFViewer>
//   )
// }      

// export default InvoicePDF
