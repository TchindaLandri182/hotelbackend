import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

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
    textAlign: 'center'
  },
  hotelInfo: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
    fontStyle: 'italic'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
    backgroundColor: '#f9fafb',
    padding: 5,
    borderLeft: 3,
    borderLeftColor: '#2563eb'
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    width: '40%',
    color: '#374151'
  },
  value: {
    fontSize: 11,
    width: '60%',
    color: '#6b7280'
  },
  bilingual: {
    fontSize: 9,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginLeft: 5
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#e5e7eb'
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  signatureBox: {
    width: '45%',
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
  officialStamp: {
    textAlign: 'center',
    marginTop: 20
  },
  stampLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20
  },
  stampBox: {
    borderWidth: 1,
    borderColor: '#000000',
    height: 60,
    width: '100%'
  }
})

const PolicePDF = ({ stay, hotel, language = 'fr' }) => {
  const isEnglish = language === 'en'
  
  const translations = {
    fr: {
      title: 'FICHE DE POLICE',
      subtitle: 'Déclaration d\'hébergement touristique',
      hotelInfo: 'Informations de l\'établissement',
      guestInfo: 'Informations du client',
      stayInfo: 'Informations du séjour',
      hotelName: 'Nom de l\'hôtel',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      lastName: 'Nom',
      firstName: 'Prénom',
      dateOfBirth: 'Date de naissance',
      placeOfBirth: 'Lieu de naissance',
      nationality: 'Nationalité',
      profession: 'Profession',
      residenceAddress: 'Adresse de résidence',
      idNumber: 'Numéro de pièce d\'identité',
      idIssueDate: 'Date de délivrance',
      idIssuePlace: 'Lieu de délivrance',
      roomNumber: 'Numéro de chambre',
      roomCategory: 'Catégorie de chambre',
      checkInDate: 'Date d\'arrivée',
      checkOutDate: 'Date de départ',
      actualCheckIn: 'Arrivée réelle',
      actualCheckOut: 'Départ réel',
      stayStatus: 'Statut du séjour',
      notes: 'Observations',
      clientSignature: 'Signature du client',
      hotelSignature: 'Signature de l\'établissement',
      officialStamp: 'Cachet officiel',
      date: 'Date',
      generatedOn: 'Généré le'
    },
    en: {
      title: 'POLICE REPORT',
      subtitle: 'Tourist Accommodation Declaration',
      hotelInfo: 'Hotel Information',
      guestInfo: 'Guest Information',
      stayInfo: 'Stay Information',
      hotelName: 'Hotel Name',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      lastName: 'Last Name',
      firstName: 'First Name',
      dateOfBirth: 'Date of Birth',
      placeOfBirth: 'Place of Birth',
      nationality: 'Nationality',
      profession: 'Profession',
      residenceAddress: 'Residence Address',
      idNumber: 'ID Number',
      idIssueDate: 'Issue Date',
      idIssuePlace: 'Issue Place',
      roomNumber: 'Room Number',
      roomCategory: 'Room Category',
      checkInDate: 'Check-in Date',
      checkOutDate: 'Check-out Date',
      actualCheckIn: 'Actual Check-in',
      actualCheckOut: 'Actual Check-out',
      stayStatus: 'Stay Status',
      notes: 'Notes',
      clientSignature: 'Client Signature',
      hotelSignature: 'Hotel Signature',
      officialStamp: 'Official Stamp',
      date: 'Date',
      generatedOn: 'Generated on'
    }
  }

  const t = translations[language]
  const tSecond = translations[isEnglish ? 'fr' : 'en']

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelInfo}>{hotel.address}</Text>
          <Text style={styles.hotelInfo}>
            {t.phone}: {hotel.phone || 'N/A'}
          </Text>
          <Text style={styles.hotelInfo}>
            {t.email}: {hotel.email || 'N/A'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {t.title} / {tSecond.title}
        </Text>
        {/*<Text style={styles.subtitle}>
          {t.subtitle} / {tSecond.subtitle}
        </Text>*/}

        {/* Hotel Information Section */}
        {/*<View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.hotelInfo} / {tSecond.hotelInfo}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.hotelName}:
              <Text style={styles.bilingual}> / {tSecond.hotelName}:</Text>
            </Text>
            <Text style={styles.value}>{hotel.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.address}:
              <Text style={styles.bilingual}> / {tSecond.address}:</Text>
            </Text>
            <Text style={styles.value}>{hotel.address}</Text>
          </View>
        </View>*/}

        {/* Guest Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.guestInfo} / {tSecond.guestInfo}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.lastName}:
              <Text style={styles.bilingual}> / {tSecond.lastName}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.lastName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.firstName}:
              <Text style={styles.bilingual}> / {tSecond.firstName}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.firstName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.dateOfBirth}:
              <Text style={styles.bilingual}> / {tSecond.dateOfBirth}:</Text>
            </Text>
            <Text style={styles.value}>
              {stay.client.dateOfBirth ? 
                new Date(stay.client.dateOfBirth).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : 
                'N/A'
              }
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.placeOfBirth}:
              <Text style={styles.bilingual}> / {tSecond.placeOfBirth}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.placeOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.nationality}:
              <Text style={styles.bilingual}> / {tSecond.nationality}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.nationality || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.profession}:
              <Text style={styles.bilingual}> / {tSecond.profession}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.profession || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.residenceAddress}:
              <Text style={styles.bilingual}> / {tSecond.residenceAddress}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.adresse || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.idNumber}:
              <Text style={styles.bilingual}> / {tSecond.idNumber}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.nIDC || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.idIssueDate}:
              <Text style={styles.bilingual}> / {tSecond.idIssueDate}:</Text>
            </Text>
            <Text style={styles.value}>
              {stay.client.dateOfDelivrance ? 
                new Date(stay.client.dateOfDelivrance).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : 
                'N/A'
              }
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.idIssuePlace}:
              <Text style={styles.bilingual}> / {tSecond.idIssuePlace}:</Text>
            </Text>
            <Text style={styles.value}>{stay.client.placeOfDelivrance || 'N/A'}</Text>
          </View>
        </View>

        {/* Stay Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.stayInfo} / {tSecond.stayInfo}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.roomNumber}:
              <Text style={styles.bilingual}> / {tSecond.roomNumber}:</Text>
            </Text>
            <Text style={styles.value}>{stay.room.roomNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.roomCategory}:
              <Text style={styles.bilingual}> / {tSecond.roomCategory}:</Text>
            </Text>
            <Text style={styles.value}>
              {language === 'fr' ? 
                stay.room.category?.name?.fr : 
                stay.room.category?.name?.en
              }
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.checkInDate}:
              <Text style={styles.bilingual}> / {tSecond.checkInDate}:</Text>
            </Text>
            <Text style={styles.value}>
              {new Date(stay.startDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.checkOutDate}:
              <Text style={styles.bilingual}> / {tSecond.checkOutDate}:</Text>
            </Text>
            <Text style={styles.value}>
              {new Date(stay.endDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.actualCheckIn}:
              <Text style={styles.bilingual}> / {tSecond.actualCheckIn}:</Text>
            </Text>
            <Text style={styles.value}>
              {stay.actualCheckIn ? 
                new Date(stay.actualCheckIn).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : 
                'N/A'
              }
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.actualCheckOut}:
              <Text style={styles.bilingual}> / {tSecond.actualCheckOut}:</Text>
            </Text>
            <Text style={styles.value}>
              {stay.actualCheckOut ? 
                new Date(stay.actualCheckOut).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : 
                'N/A'
              }
            </Text>
          </View>
          {/*<View style={styles.infoRow}>
            <Text style={styles.label}>
              {t.stayStatus}:
              <Text style={styles.bilingual}> / {tSecond.stayStatus}:</Text>
            </Text>
            <Text style={styles.value}>{stay.status}</Text>
          </View>*/}
          {stay.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>
                {t.notes}:
                <Text style={styles.bilingual}> / {tSecond.notes}:</Text>
              </Text>
              <Text style={styles.value}>{stay.notes}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.subtitle}>
            {t.generatedOn} / {tSecond.generatedOn}: {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </Text>

          <View style={styles.signature}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                {t.clientSignature}
              </Text>
              <Text style={styles.bilingual}>
                {tSecond.clientSignature}
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>
                {t.date}: _______________
              </Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                {t.hotelSignature}
              </Text>
              <Text style={styles.bilingual}>
                {tSecond.hotelSignature}
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>
                {t.date}: _______________
              </Text>
            </View>
          </View>

          {/*<View style={styles.officialStamp}>
            <Text style={styles.stampLabel}>
              {t.officialStamp} / {tSecond.officialStamp}
            </Text>
            <View style={styles.stampBox}></View>
          </View>*/}

        </View>
      </Page>
    </Document>
  )
}

export default PolicePDF