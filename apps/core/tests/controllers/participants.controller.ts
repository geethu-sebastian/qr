import { describe } from 'mocha';
import { expect } from 'chai';

import {
  getAllEventParticipants,
  getEventParticipantById,
} from '../../src/controllers/participants.controller';

describe('Participants', () => {
  describe('Get all participant', () => {
    it('should return a list of participants', async () => {
      const participants = await getAllEventParticipants();
      expect(participants).to.be.an('array');
      expect(participants).to.have.length.greaterThan(0);
    });
  });

  // describe("Get participant by id", () => {
  //   it("should return a participant", async () => {
  //     const participant = await getParticipantById(
  //       "c599ed75-7300-446f-a1c5-2e52cb4ae41a"
  //     )
  //     expect(participant).to.be.an("object")
  //   })
  // })
});
