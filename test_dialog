# Dialog Map

This map shows the main route-driven dialogs and modals in the app. Pages are shown as rectangular nodes; dialogs and modals are shown as rounded nodes.

```mermaid
flowchart TB
  subgraph Auth[Auth Flows]
    Landing[Landing Page]
    SignIn[Sign In]
    SignUp[Sign Up]
    Forgot[Forgot Password]
    Reset[Reset Password]
    Logout[Logout]

    Landing --> SignIn
    Landing --> SignUp
    SignIn --> Forgot
    Forgot --> Reset
    SignIn --> Logout
  end

  subgraph Owner[Owner Flows]
    OwnerHome[Owner Dashboard]
    MyPets[My Pets]
    AddPet((Add Pet Modal))
    DeletePet((Delete Pet Modal))
    Search[Search Caregivers]
    SearchFilters((Filters Modal))
    SearchDates((Date Picker Modal))
    OwnerCaregiverProfile[Caregiver Profile]
    Booking((Booking Modal))
    BookingConfirm((Booking Confirmation Modal))
    Bookings[My Bookings]
    Review((Review Modal))
    Incident((Incident Modal))
    ActiveCare[Active Care]
    OwnerMessages[Messages]
    Report((Report User Dialog))
    ImagePreview((Image Preview Modal))
    PaymentDialog((Payment Dialog))
    Transactions[Transactions]
    Payment((Payment Modal))
    ApplyCaregiver[Apply as Caregiver]
    Availability((Caregiver Availability Modal))
    PetBlueprint[Pet Profile / Blueprint]

    OwnerHome --> MyPets
    MyPets --> AddPet
    MyPets --> DeletePet

    OwnerHome --> Search
    Search --> SearchFilters
    Search --> SearchDates
    Search --> OwnerCaregiverProfile
    OwnerCaregiverProfile --> Booking
    Booking --> BookingConfirm

    OwnerHome --> Bookings
    Bookings --> Review
    Bookings --> Incident
    ActiveCare --> Incident

    OwnerHome --> OwnerMessages
    OwnerMessages --> Report
    OwnerMessages --> ImagePreview
    OwnerMessages --> PaymentDialog

    OwnerHome --> Transactions
    Transactions --> Payment

    OwnerHome --> ApplyCaregiver
    ApplyCaregiver --> Availability

    OwnerHome --> PetBlueprint
  end

  subgraph Caregiver[Caregiver Flows]
    CaregiverHome[Caregiver Dashboard]
    CaregiverProfilePage[Caregiver Profile]
    CaregiverEdit[Edit Profile]
    CaregiverRequests[Requests]
    CaregiverMessages[Messages]
    CaregiverTransactions[Transactions]
    CaregiverUpload[Upload Check-in]
    AvailabilityModal((Caregiver Availability Modal))
    WindowDialog((Window Dialog))

    CaregiverHome --> CaregiverProfilePage
    CaregiverProfilePage --> CaregiverEdit
    CaregiverHome --> CaregiverRequests
    CaregiverHome --> CaregiverMessages
    CaregiverHome --> CaregiverTransactions
    CaregiverHome --> CaregiverUpload
    CaregiverHome --> AvailabilityModal
    CaregiverHome --> WindowDialog
  end

  subgraph Admin[Admin Flows]
    AdminHome[Admin Dashboard]
    Verified[Verified Queue]
    Incidents[Incidents]
    Refunds[Refunds]
    RefundDismiss((Dismiss Confirmation Modal))

    AdminHome --> Verified
    AdminHome --> Incidents
    AdminHome --> Refunds
    Refunds --> RefundDismiss
  end
```

## Dialog Summary

- Authentication: sign in, sign up, forgot password, reset password, logout.
- Owner: pet add/delete, search filters, date picker, booking, booking confirmation, review, incident, message report, image preview, payment, caregiver application availability.
- Caregiver: availability setup and booking completion confirmation.
- Admin: refund dismissal confirmation.

## Notes

- The map focuses on dialogs and modals that are present in the app code.
