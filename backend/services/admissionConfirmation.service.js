const { sequelize, Admission, Application, Program, Quota, Institution } = require('../models');


async function confirmAdmission(admissionId) {
    const transaction = await sequelize.transaction();

    try {
      const admission = await Admission.findByPk(admissionId, {
        include: [{ model: Program }, { model: Quota, as: "Quota" }],
        transaction,
      });

      if (!admission) throw new Error("Admission not found");

      if (admission.feeStatus !== "PAID") {
        throw new Error("Fee not paid for this admission");
      }

      if (admission.confirmed) {
        throw new Error("Admission already confirmed");
      }

      const count = await Admission.count({
        where: { programId: admission.programId, confirmed: true },
        transaction,
      });

      const sequence = String(count + 1).padStart(4, "0");

      const admissionNumber = `INST/${new Date().getFullYear()}/${admission.Program?.courseType || "NA"}/${admission.Program?.name || "NA"}/${admission.Quota?.quotaType || "NA"}/${sequence}`;

      admission.admissionNumber = admissionNumber;
      admission.confirmed = true;
      await admission.save({ transaction });

      await Application.update(
        {
          status: "ADMISSION_CONFIRMED",
        },
        {
          where: { id: admission.applicantId },
          transaction,
        },
      );
      //Once admission is confirmed, we can create a document record for the applicant to upload necessary documents for admission process
      

      await transaction.commit();
      return admission;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = { confirmAdmission };