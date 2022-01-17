/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */

import { SessionState } from '../../core/constants/session-state.enum';

export class SessionModel {

    public sessionState: SessionState = SessionState.Ended;
}
