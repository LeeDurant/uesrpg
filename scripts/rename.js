import { log_msg as log } from './util.js'

export function init() {
    log('attack_rename', 'Initializing');
    game.settings.register("ffg-star-wars-enhancements", "auto-rename-actors", {
        name: game.i18n.localize('ffg-star-wars-enhancements.rename.auto'),
        hint: game.i18n.localize('ffg-star-wars-enhancements.rename.auto-hint'),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });
    log('attack_rename', 'Initialized');
}

export function rename_actors(created_data, ...args) {
    if (args[0] === 'Combatant' && game.settings.get("ffg-star-wars-enhancements", "auto-rename-actors")) {
        log('attack_rename', 'Found combatant(s) being added to combat');
        // iterate over the combatants and update each one
        for (var i = 0; i < args[1].length; i++) {
            if (Array.isArray(created_data)) {
                var update_data = {
                    '_id': created_data[i]['_id'],
                }
            }
            else {
                var update_data = {
                    '_id': created_data['_id'],
                }
            }

            log('attack_rename', 'Searching for combatant "' + update_data['_id'] + '" in combat');
            for (var x in game.combat.data.combatants) {
                // check the disposition and update the name and image
                // this is done as a second (different) call because we want to update the information on a temporary basis
                // and we can't specify part of the data is temporary
                if (game.combat.data.combatants[x]['_id'] == update_data['_id']) {
                    if (game.combat.data.combatants[x].token.disposition === TOKEN_DISPOSITIONS['FRIENDLY']) {
                        update_data['name'] = 'PC';
                        update_data['img'] = 'systems/starwarsffg/images/dice/starwars/lightside.png';
                    }
                    else {
                        update_data['name'] = 'NPC';
                        update_data['img'] = 'systems/starwarsffg/images/dice/starwars/darkside.png';
                    }
                }
            }
            log('attack_rename', 'Renaming token');
            game.combat.updateEmbeddedEntity("Combatant", update_data, {temporary: true});
        }
    }
    else {
        log('attack_rename', 'Detected combatant being added to combat, but feature is disabled. Aborting.');
    }
}
