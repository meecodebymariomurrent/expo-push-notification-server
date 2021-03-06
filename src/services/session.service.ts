/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */
import 'reflect-metadata';
import { injectable } from 'inversify';
import { Session } from '../models/session.model';
import { SessionState } from '../constants/session-state.enum';
import { User } from '../models/user.model';

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
     * @param user the user to use
     * @param token the token to use
     * @returns {Session} the session model
     */
    public startSession(user: User, token: string): Session {
        const session = new Session();
        if (!this.sessions.has(token)) {
            this.sessions.set(token, user.id);
        }
        session.sessionState = SessionState.Active;
        return session;
    }

    /**
     * Stops the session for a user
     *
     * @param username the username to use
     * @param token the token to use
     * @returns {Session} the session model
     */
    public stopSession(username: string, token: string): Session {
        const session = new Session();
        if (this.sessions.has(token)) {
            this.sessions.delete(token);
            session.sessionState = SessionState.Ended;
        }
        return session;
    }
}
