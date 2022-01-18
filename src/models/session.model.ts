/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */

import { SessionState } from '../constants/session-state.enum';

export class Session {

    constructor(public sessionState: SessionState = SessionState.Ended) {
    }
}
