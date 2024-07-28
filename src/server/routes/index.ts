import { Router } from 'express';

import {
    FilmesController,
    PerfisController,
    UsuariosController,
} from './../controllers';
import { ensureAuthenticated } from '../shared/middleware';
import { WatchListController } from '../controllers/watchlist';

const router = Router();

router.get('/', (_, res) => {
    return res.send('Desafio técnico - JERA');
});

// Usuários
router.post(
    '/entrar',
    UsuariosController.signInValidation,
    UsuariosController.signIn
);
router.post(
    '/cadastrar',
    UsuariosController.signUpValidation,
    UsuariosController.signUp
);

// Perfis
router.post(
    '/perfis',
    ensureAuthenticated,
    PerfisController.createValidation,
    PerfisController.create
);
router.get('/perfis', ensureAuthenticated, PerfisController.getByUid);

// Filmes
router.get(
    '/filmes',
    ensureAuthenticated,
    FilmesController.searchValidation,
    FilmesController.search
);
router.get(
    '/filmes/:perfilId/sugeridos',
    ensureAuthenticated,
    FilmesController.suggestedValidation,
    FilmesController.suggested
);

// WatchList
router.post(
    '/filmes/:perfilId/para-assistir/:filmeId',
    ensureAuthenticated,
    WatchListController.createValidation,
    WatchListController.create
);
router.get(
    '/filmes/:perfilId/para-assistir',
    ensureAuthenticated,
    WatchListController.getAllValidation,
    WatchListController.getAll
);
router.patch(
    '/filmes/:perfilId/para-assistir/:id/assistido',
    ensureAuthenticated,
    WatchListController.markAsWatchedValidation,
    WatchListController.markAsWatched
);

export { router };
