import { Participant } from 'common';

const pg = require('pgdatabase').pg;

type ParticipantService = {
  addNewParticipantService: (
    organizationId: string,
    eventId: string,
    firstName: string,
    lastName: string,
  ) => Promise<Participant>;
  getAllParticipantsService: (organizationId: string, eventId: string) => Promise<Participant[]>;
  getParticipantService: (
    organizationId: string,
    eventId: string,
    participantId: string,
  ) => Promise<Participant>;
};

const participantService = (): ParticipantService => {
  return {
    addNewParticipantService: async (
      organizationId: string,
      eventId: string,
      firstName: string,
      lastName: string,
    ) => {
      try {
        await pg.query('BEGIN');
        let newParticipant: Participant = (
          await pg.query(
            `INSERT INTO participant (organization_id, event_id, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *`,
            [organizationId, eventId, firstName, lastName],
          )
        ).rows[0];

        if (!newParticipant) throw new Error('Something went wrong');

        await pg.query('COMMIT');
        return newParticipant;
      } catch (err: any) {
        await pg.query('ROLLBACK');
        console.error(err);
        throw new Error('Something went wrong');
      }
    },
    getAllParticipantsService: async (organizationId: string, eventId: string) => {
      try {
        let participants: Participant[] = (
          await pg.query(
            `SELECT 
                                    participant.id as id,
                                    participant.organization_id as organizationId, 
                                    participant.event_id as eventId, first_name as "firstName", 
                                    last_name as "lastName" ,
                                    check_in_time as "checkInTime",
                                    checked_in as "checkedIn"
                                    FROM 
                                        participant 
                                    LEFT JOIN
                                        participant_check_in
                                    ON 
                                        participant.id = participant_check_in.participant_id
                                    WHERE 
                                        participant.organization_id = $1
                                    AND participant.event_id = $2`,
            [organizationId, eventId],
          )
        ).rows;

        if (!participants) {
          throw new Error('Something went wrong');
        }

        return participants;
      } catch (err: any) {
        console.error(err);
        throw new Error('Something went wrong');
      }
    },

    getParticipantService: async (
      organizationId: string,
      eventId: string,
      participantId: string,
    ) => {
      try {
        let participant: Participant = (
          await pg.query(
            `SELECT organization_id as organizationId, event_id as eventId, first_name as "firstName", last_name as "lastName" FROM participant WHERE organization_id = $1 AND event_id = $2 AND id = $3`,
            [organizationId, eventId, participantId],
          )
        ).rows[0];

        return participant;
      } catch (err: any) {
        console.error(err);
        throw new Error('Something went wrong');
      }
    },
  };
};
export default participantService;
export type { ParticipantService };
