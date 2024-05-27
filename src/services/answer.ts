import http from "@/plugins/http";

export interface Tokens {
    access: string
    refresh: string
}

export interface ErrorResponse {
    errorMessage: string
    timestamp: Date
    status: number
    path: string
}

export interface SurveyResponse extends ErrorResponse{
    surveyBody: any
    body: any
    language: string
    tokens: Tokens
}

export const respondentService = new class RespondentService {
    get path (): string {
        return '/respondent/'
    }

    async start(hash:string): Promise<SurveyResponse> {
        return ((await http.get(this.path + `${hash}/start`)).data)
    }

    async login(hash:string, password: string): Promise<SurveyResponse> {
        return (await http.post(this.path + `${hash}/login`, {
            password: password
        })).data
    }

    async answer(hash:string, body: any, partial: boolean, accessToken: string): Promise<void | ErrorResponse> {
        return (await http.patch(this.path + `${hash}/answer?isCompleted=${!partial}`, body, {
            headers: {
                'Authorization': accessToken
            }
        })).data
    }
}
