/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */
import 'reflect-metadata';
import { injectable } from 'inversify';
import { SessionModel } from '../../api/common/session.model';
import { SessionState } from '../constants/session-state.enum';

@injectable()
export class SessionService {

    private sessions = new Map<string, string>();

    /**
     * Check if an active session exists
     *
     * @param token the token to use
     * @returns {boolean} a value indicating whether the session is active or not
     */
    public hasActiveSession(token: string): boolean {
        return this.sessions.has(token);
    }

    /**
     * Starts the session for a user
     *
     * @param username the username to use
     * @param token the token to use
     * @returns {SessionModel} the session model
     */
    public startSession(username: string, token: string): SessionModel {
        const session = new SessionModel();
        if (!this.sessions.has(token)) {
            this.sessions.set(token, username);
        }
        session.sessionState = SessionState.Active;
        return session;
    }

    /**
     * Stops the session for a user
     *
     * @param username the username to use
     * @param token the token to use
     * @returns {SessionModel} the session model
     */
    public stopSession(username: string, token: string): SessionModel {
        const session = new SessionModel();
        if (this.sessions.has(token)) {
            this.sessions.delete(token);
            session.sessionState = SessionState.Ended;
        }
        return session;
    }
}
