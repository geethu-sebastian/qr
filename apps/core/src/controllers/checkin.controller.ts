import {Request, Response} from 'express';
import {CheckinService} from "../services/checkin.service";

const checkinController = (checkinService: CheckinService) => {
    return {
        checkinParticipantController: async (req: Request, res: Response) => {
            try {
                const user = req?.body?.user;
                const organizationId = req?.params?.organizationId;
                const eventId = req?.params?.eventId;
                const participantId = req?.params?.participantId;
                const checkinTime = req?.body?.checkinDetails?.checkinTime;

                if (!organizationId || organizationId === '' || organizationId === undefined) {
                    return res.status(400).json({error: 'Organization ID is required'});
                }

                if (!eventId || eventId === '' || eventId === undefined) {
                    return res.status(400).json({error: 'Event ID is required'});
                }

                if (!participantId || participantId === '' || participantId === undefined) {
                    return res.status(400).json({error: 'Participant ID is required'});
                }

                if (!checkinTime || checkinTime === '' || checkinTime === undefined) {
                    return res.status(400).json({error: 'Checkin time is required'});
                }

                const newParticipantCheckin = await checkinService().checkinParticipantService(
                        organizationId,
                        eventId,
                        participantId,
                        checkinTime,
                        user.id
                    )
                ;

                return res.status(201).json({newParticipantCheckin});
            } catch (err) {
                return res.status(500).json({error: err.message});
            }
        },
    };
};

export default checkinController
