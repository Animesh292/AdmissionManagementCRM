Live link - https://admissionmanagementcrm-frontend.onrender.com/

I built a complete Admission Management CRM that manages the full admission lifecycle with strict seat control, workflow validation, and concurrency-safe seat allocation.

Key Features:

Create applicants and manage their admission journey end-to-end

Real-time seat allocation under selected program and quota

Strict quota validation to prevent seat overbooking

Transaction-based seat locking to handle concurrent allocation requests safely

Fee-gated admission confirmation workflow

Generation of unique and immutable admission numbers

Document verification tracking for admission officers

Basic UI for easy operation by staff and admission managers

Dashboard APIs for intake vs admitted and quota-wise seat status

Seat Allocation Logic:

During seat allocation, the system validates quota availability by checking filled seats against total seats for a program and quota. If seats are unavailable, the applicant remains in the registered state.
When a seat is available, an admission record is created with fee status set to pending, and the quota’s filled seat counter is updated atomically using database transactions.

Admission Confirmation Workflow:

Admission is confirmed only after the fee is marked as paid. Upon confirmation:

A unique and immutable admission number is generated

Applicant status is updated to admitted

Seat occupancy remains consistent across concurrent requests

Data Integrity & Business Logic Design:

The system separates business logic from database integrity constraints:

Foreign key constraints ensure only valid applicants can proceed to admission allocation

Application-level validations enforce quota capacity rules and workflow state transitions

Document Verification:

Admission officers can track pending documents and mark them as verified once submitted, ensuring a controlled verification workflow before final confirmation.

Concurrency Handling:

To prevent race conditions during seat allocation, database transactions with row-level locking were implemented using Sequelize.
If multiple users attempt to allocate the last available seat simultaneously, only one transaction succeeds while others wait and correctly detect that the quota is full.

Overall:

The system enforces strict quota-based seat control, fee-gated admission confirmation, immutable admission number generation, and document verification tracking in a consistent and race-condition-safe manner.
