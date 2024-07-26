import { Router } from 'express';

import {
    CidadesController,
    FilmesController,
    PerfisController,
    PessoasController,
    UsuariosController,
} from './../controllers';
import { ensureAuthenticated } from '../shared/middleware';
import { WatchListController } from '../controllers/watchlist';

const router = Router();

router.get('/', (_, res) => {
    return res.send('Desafio técnico - JERA');
});

// Cidades
router.get(
    '/cidades',
    ensureAuthenticated,
    CidadesController.getAllValidation,
    CidadesController.getAll
);
router.get(
    '/cidades/:id',
    ensureAuthenticated,
    CidadesController.getByIdValidation,
    CidadesController.getById
);
router.put(
    '/cidades/:id',
    ensureAuthenticated,
    CidadesController.updateByIdValidation,
    CidadesController.updateById
);
router.delete(
    '/cidades/:id',
    ensureAuthenticated,
    CidadesController.deleteByIdValidation,
    CidadesController.deleteById
);
router.post(
    '/cidades',
    ensureAuthenticated,
    CidadesController.createValidation,
    CidadesController.create
);

// Pessoas
router.get(
    '/pessoas',
    ensureAuthenticated,
    PessoasController.getAllValidation,
    PessoasController.getAll
);
router.get(
    '/pessoas/:id',
    ensureAuthenticated,
    PessoasController.getByIdValidation,
    PessoasController.getById
);
router.put(
    '/pessoas/:id',
    ensureAuthenticated,
    PessoasController.updateByIdValidation,
    PessoasController.updateById
);
router.delete(
    '/pessoas/:id',
    ensureAuthenticated,
    PessoasController.deleteByIdValidation,
    PessoasController.deleteById
);
router.post(
    '/pessoas',
    ensureAuthenticated,
    PessoasController.createValidation,
    PessoasController.create
);

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
router.post(
    '/perfis/selecionar',
    ensureAuthenticated,
    PerfisController.selectValidation,
    PerfisController.select
);

// Filmes
router.get(
    '/filmes',
    ensureAuthenticated,
    FilmesController.searchValidation,
    FilmesController.search
);

// WatchList
router.post(
    '/filmes/para-assistir',
    ensureAuthenticated,
    WatchListController.createValidation,
    WatchListController.create
);
router.get(
    '/filmes/para-assistir',
    ensureAuthenticated,
    WatchListController.getAllValidation,
    WatchListController.getAll
);
router.patch(
    '/filmes/para-assistir/:id/assistido',
    ensureAuthenticated,
    WatchListController.markAsWatchedValidation,
    WatchListController.markAsWatched
);

export { router };
