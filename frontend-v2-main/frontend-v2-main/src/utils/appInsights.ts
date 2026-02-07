import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { APP_INSIGHTS } from '../lib/config';

let ai: ApplicationInsights;

export const useAppInsights = () => {
    const initAI = () => {
        ai = new ApplicationInsights({ config: { connectionString: APP_INSIGHTS }});
        ai.loadAppInsights();
    };

    return { ai, initAI };
};

export const getAppInsights = () => ai;
