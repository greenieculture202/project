import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
export const appConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
        provideHttpClient()
    ]
};
//# sourceMappingURL=app.config.js.map