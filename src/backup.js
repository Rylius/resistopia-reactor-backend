const log = require('log4js').getLogger('backup');
const config = require('../config.json').backup;

const fs = require('fs');
const path = require('path');

function deleteOldTemporaryFiles() {
    fs.readdir(
        config.directories.temporary, config.encoding,
        (err, files) => {
            if (err) {
                log.error('Failed to read temporary backups directory', err);
                return;
            }

            const filesToDelete = files.length - config.maxTemporaryFiles;
            if (filesToDelete <= 0) {
                return;
            }

            log.debug('Preparing to delete %d old temporary backups', filesToDelete);

            let filesDeleted = false;
            const stats = [];
            files.forEach(file => {
                const filePath = path.join(config.directories.temporary, file);
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        log.error(err);
                        return;
                    }

                    stat.file = file;
                    stat.path = filePath;
                    stats.push(stat);

                    if (stats.length >= files.length && !filesDeleted) {
                        deleteFiles(filesToDelete, stats);
                        filesDeleted = true;
                    }
                });
            });
        });
}

function deleteFiles(filesToDelete, stats) {
    stats.sort((a, b) => {
        if (a.birthtime === b.birthtime) {
            return 0;
        }
        return a.birthtime > b.birthtime ? 1 : -1;
    });

    for (let i = 0; i < filesToDelete; i++) {
        const filePath = stats[i].path;
        log.trace('Deleting temporary state "%s"', filePath);
        fs.unlink(filePath, (err) => {
            if (err) {
                log.error('Failed to delete temporary state "%s"', filePath, err);
            }
        });
    }
}

function saveTemporary(state) {
    log.debug('Saving temporary state...');

    deleteOldTemporaryFiles();

    fs.writeFile(
        path.join(config.directories.temporary, `tick_${state.tick}.json`),
        JSON.stringify(state), {encoding: config.encoding},
        err => {
            if (err) {
                log.error('Failed to save temporary state', err);
                return;
            }

            log.debug('Temporary state saved');
        });
}

function savePersistent(state) {
    log.debug('Saving persistent state...');

    const date = new Date(state.time);
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

    fs.writeFile(
        path.join(config.directories.persistent, `tick_${formattedDate}.json`),
        JSON.stringify(state), {encoding: config.encoding},
        err => {
            if (err) {
                log.error('Failed to save persistent state', err);
                return;
            }

            log.debug('Persistent state saved');
        });
}

module.exports = {
    saveTemporary,
    savePersistent,
};
