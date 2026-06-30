/*

Links Relink Subfolders
Copyright 2024 William Campbell
All Rights Reserved
https://www.marspremedia.com/contact

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

(function () {

    var title = "Links Relink Subfolders";

    if (!/indesign/i.test(app.name)) {
        alert("Script for InDesign", title, false);
        return;
    }

    // Script variables.
    var count;
    var doneMessage;
    var error;
    var files;
    var fileNameDupes;
    var fileNames;
    var folderInput;
    var folderSearch;
    var log;
    var progress;

    // Reusable UI variables.
    var g; // group
    var p; // panel
    var w; // window

    // Permanent UI variables.
    var btnCancel;
    var btnFolderInput;
    var btnFolderSearch;
    var btnOk;
    var cbSubfolders;
    var grpFolderInput;
    var inpIgnore;
    var rbMissingLinks;
    var rbProcessActiveDoc;
    var rbProcessFolder;
    var rbProcessOpenDocs;
    var txtFolderInput;
    var txtFolderSearch;

    // LANGUAGE EXTENSIONS

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (x) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == x) {
                    return i;
                }
            }
            return -1;
        };
    }

    // LOG

    log = {
        entries: [],
        file: null,
        // Default write log to user desktop.
        // Preferably set 'log.path' to a meaningful
        // location in later code once location exists.
        path: Folder.desktop,
        add: function (message) {
            if (message instanceof Array) {
                while (message.length) {
                    this.entries.push(message.shift());
                }
            } else {
                this.entries.push(message);
            }
        },
        addFile: function (fileName, entries) {
            this.add(File.decode(fileName));
            if (entries instanceof Array) {
                while (entries.length) {
                    log.add("----> " + entries.shift());
                }
            } else {
                log.add("----> " + entries);
            }
        },
        write: function () {
            var contents;
            var d;
            var fileName;
            var padZero = function (v) {
                return ("0" + v).slice(-2);
            };
            if (!this.entries.length) {
                // No log entries to report.
                this.file = null;
                return;
            }
            contents = this.entries.join("\r") + "\r";
            // Create file name.
            d = new Date();
            fileName =
                title +
                " " +
                "Log" +
                " " +
                d.getFullYear() +
                "-" +
                padZero(d.getMonth() + 1) +
                "-" +
                padZero(d.getDate()) +
                "-" +
                padZero(d.getHours()) +
                padZero(d.getMinutes()) +
                padZero(String(d.getSeconds()).substr(0, 2)) +
                ".txt";
            // Open and write log file.
            this.file = new File(this.path + "/" + fileName);
            this.file.encoding = "UTF-8";
            try {
                if (!this.file.open("w")) {
                    throw new Error("Failed to open log file.");
                }
                if (!this.file.write(contents)) {
                    throw new Error("Failed to write log file.");
                }
            } catch (e) {
                this.file = null;
                throw e;
            } finally {
                this.file.close();
            }
            // Log successfully written.
            // log.file == true (not null) indicates a log was written.
        }
    };

    // CREATE PROGRESS WINDOW

    // Variation with second static text and progress bar.
    progress = new Window("palette", "Progress", undefined, {
        "closeButton": false
    });
    progress.t1 = progress.add("statictext");
    progress.t1.preferredSize.width = 450;
    progress.b1 = progress.add("progressbar");
    progress.b1.preferredSize.width = 450;
    progress.t2 = progress.add("statictext");
    progress.t2.preferredSize.width = 450;
    progress.b2 = progress.add("progressbar");
    progress.b2.preferredSize.width = 450;
    progress.display1 = function (message1) {
        message1 && (this.t1.text = message1);
        this.show();
        this.update();
    };
    progress.display2 = function (message2) {
        message2 && (this.t2.text = message2);
        this.show();
        this.update();
    };
    progress.increment1 = function () {
        this.b1.value++;
    };
    progress.increment2 = function () {
        this.b2.value++;
    };
    progress.set1 = function (steps) {
        this.b1.value = 0;
        this.b1.minvalue = 0;
        this.b1.maxvalue = steps;
    };
    progress.set2 = function (steps) {
        this.b2.value = 0;
        this.b2.minvalue = 0;
        this.b2.maxvalue = steps;
    };

    // CREATE USER INTERFACE

    w = new Window("dialog", title);
    w.alignChildren = "fill";

    // Panel 'Process'
    p = w.add("panel", undefined, "Process");
    p.alignChildren = "left";
    p.margins = [24, 24, 24, 18];
    g = p.add("group");
    rbProcessActiveDoc = g.add("radiobutton", undefined, "Active document");
    rbProcessOpenDocs = g.add("radiobutton", undefined, "Open documents");
    rbProcessFolder = g.add("radiobutton", undefined, "Folder");
    g = g.add("group");
    g.margins.left = 9;
    cbSubfolders = g.add("checkbox", undefined, "Include subfolders");
    grpFolderInput = p.add("group");
    btnFolderInput = grpFolderInput.add("button", undefined, "Folder...");
    txtFolderInput = grpFolderInput.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFolderInput.preferredSize.width = 360;

    // Panel 'Search for links in folder'
    p = w.add("panel", undefined, "Search for links in folder");
    p.alignChildren = "left";
    p.margins = [24, 24, 24, 18];
    g = p.add("group");
    btnFolderSearch = g.add("button", undefined, "Folder...");
    txtFolderSearch = g.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFolderSearch.preferredSize.width = 360;
    g = p.add("group");
    g.margins.top = 9;
    g.add("statictext", undefined, "Ignore:");
    inpIgnore = g.add("edittext", undefined, "");
    inpIgnore.preferredSize.width = 370;
    g = p.add("group");
    g.margins.top = 9;
    rbMissingLinks = g.add("radiobutton", undefined, "Relink missing links");
    g.add("radiobutton", undefined, "Relink all links");

    // Action Buttons
    g = w.add("group");
    g.alignment = "center";
    btnOk = g.add("button", undefined, "OK");
    btnCancel = g.add("button", undefined, "Cancel");

    // Panel Copyright
    p = w.add("panel");
    p.add("statictext", undefined, "Copyright 2024 William Campbell");

    // SET UI DEFAULTS

    rbProcessActiveDoc.enabled = false;
    rbProcessOpenDocs.enabled = false;
    rbProcessFolder.value = true;
    if (app.documents.length > 0) {
        rbProcessActiveDoc.enabled = true;
        rbProcessActiveDoc.value = true;
        rbProcessFolder.value = false;
        try {
            folderSearch = new Folder(app.activeDocument.fullName.path + "/Links");
            txtFolderSearch.text = Folder.decode(folderSearch.fullName);
        } catch (_) {
            alert("Save documents before launching script.");
            return;
        }
        if (app.documents.length > 1) {
            rbProcessOpenDocs.enabled = true;
        }
    }
    rbMissingLinks.value = true;
    configureUi();

    // UI ELEMENT EVENT HANDLERS

    rbProcessActiveDoc.onClick = configureUi;
    rbProcessOpenDocs.onClick = configureUi;
    rbProcessFolder.onClick = configureUi;
    btnFolderInput.onClick = function () {
        var f = Folder.selectDialog("Select input folder", txtFolderInput.text);
        if (f) {
            txtFolderInput.text = Folder.decode(f.fullName);
        }
    };
    btnFolderSearch.onClick = function () {
        var f = Folder.selectDialog("Select folder to search for links", txtFolderSearch.text);
        if (f) {
            txtFolderSearch.text = Folder.decode(f.fullName);
        }
    };
    btnOk.onClick = function () {
        if (rbProcessFolder.value) {
            folderInput = new Folder(txtFolderInput.text);
            if (!(folderInput && folderInput.exists)) {
                alert("Select folder to process", " ", false);
                return;
            }
        }
        folderSearch = new Folder(txtFolderSearch.text);
        if (!(folderSearch && folderSearch.exists)) {
            alert("Select folder to search for links", " ", false);
            return;
        }
        w.close(1);
    };
    btnCancel.onClick = function () {
        w.close(0);
    };

    // DISPLAY THE DIALOG

    if (w.show() == 1) {
        doneMessage = "";
        try {
            if (rbProcessActiveDoc) {
                app.doScript(process, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, title);
            } else {
                process();
            }
            // Suppression de la ligne qui affichait le message de succès
            // doneMessage = doneMessage || count + " links relinked";
        } catch (e) {
            error = error || e;
            doneMessage = "An error has occurred.\nLine " + error.line + ": " + error.message;
        }
        progress.close();
        try {
            if (rbProcessFolder.value) {
                log.path = folderInput;
            } else {
                log.path = app.activeDocument.fullName.path;
            }
            log.write();
        } catch (e) {
            alert("Error writing log:\n" + e.message, title, true);
        }
        if (log.file) {
            if (
                confirm(doneMessage +
                    "\nAlerts reported. See log for details:\n" +
                    File.decode(log.file.fullName) +
                    "\n\nOpen log?", false, title)
            ) {
                log.file.execute();
            }
        } else {
            // Affichage de l'erreur uniquement
            if (error) {
                doneMessage && alert(doneMessage, title, error);
            }
        }
    }

    //====================================================================
    //               END PROGRAM EXECUTION, BEGIN FUNCTIONS
    //====================================================================

    function configureUi() {
        if (rbProcessActiveDoc.value) {
            // Process active document.
            rbProcessOpenDocs.value = false;
            rbProcessFolder.value = false;
            grpFolderInput.enabled = false;
            cbSubfolders.enabled = false;
            cbSubfolders.value = false;
        } else if (rbProcessOpenDocs.value) {
            // Process open documents.
            rbProcessActiveDoc.value = false;
            rbProcessFolder.value = false;
            grpFolderInput.enabled = false;
            cbSubfolders.enabled = false;
            cbSubfolders.value = false;
        } else if (rbProcessFolder.value) {
            // Process folder.
            rbProcessActiveDoc.value = false;
            rbProcessOpenDocs.value = false;
            grpFolderInput.enabled = true;
            cbSubfolders.enabled = true;
        }
    }

    function getFiles(folder, subfolders, extensions, ignore) {
        // folder = folder object, not folder name.
        // subfolders = true to include subfolders.
        // extensions = string, extensions to include.
        // ignore = folder names to ignore.
        // Combine multiple extensions with RegExp OR i.e. jpg|psd|tif
        // extensions case-insensitive.
        // extensions undefined = any.
        // Ignores hidden files and folders.
        var f;
        var files;
        var i;
        var pattern;
        var results = [];
        if (extensions) {
            pattern = new RegExp("\." + extensions + "$", "i");
        } else {
            // Any extension.
            pattern = new RegExp(".*");
        }
        files = folder.getFiles();
        for (i = 0; i < files.length; i++) {
            f = files[i];
            if (!f.hidden) {
                if (f instanceof Folder && subfolders) {
                    if (ignore && ignore.indexOf(f.name) > -1) {
                        // Skip if folder in list to ignore.
                        continue;
                    }
                    // Recursive (function calls itself).
                    results = results.concat(getFiles(f, subfolders, extensions));
                } else if (f instanceof File && pattern.test(f.name)) {
                    results.push(f);
                }
            }
        }
        return results;
    }

    function process() {
        var i;
        var ignore;
        var ii;
        var iii;
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        progress.display1("Initializing...");
        try {
            ignore = inpIgnore.text.split(",");
            files = getFiles(folderSearch, true, null, ignore);
            // Make array of file names.
            fileNames = [];
            for (i = 0; i < files.length; i++) {
                fileNames[i] = File.decode(files[i].name).toLowerCase();
            }
            // Make array of duplicates.
            fileNameDupes = [];
            for (i = 0; i < fileNames.length; i++) {
                fileNameDupes[i] = [];
                for (ii = 0; ii < fileNames.length; ii++) {
                    if (i != ii && fileNames[i] == fileNames[ii]) {
                        fileNameDupes[i].push(ii);
                    }
                }
            }
            count = 0;
            if (rbProcessActiveDoc.value) {
                progress.set1(1);
                processDoc(app.activeDocument);
            } else if (rbProcessOpenDocs.value) {
                processOpenDocs();
            } else if (rbProcessFolder.value) {
                processFolder();
            }
        } catch (e) {
            error = e;
            throw e;
        } finally {
            app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        }
    }

    function processDoc(doc) {
        var i;
        var ii;
        var iii;
        var link;
        var name;
        progress.increment1();
        progress.display1(File.decode(doc.name));
        progress.set2(doc.links.length);
        loopLinks:
            for (i = 0; i < doc.links.length; i++) {
                link = doc.links[i];
                name = link.name.toLowerCase();
                progress.increment2();
                progress.display2(link.name);
                if (rbMissingLinks.value && link.status == LinkStatus.NORMAL) {
                    continue loopLinks;
                }
                for (ii = 0; ii < fileNames.length; ii++) {
                    if (fileNames[ii] == name) {
                        if (fileNameDupes[ii].length) {
                            // There are duplicates of this link.
                            // Log it, and don't relink.
                            log.add("Multiple files the same name. Manually update the link to the desired file.");
                            log.add("----> " + File.decode(files[ii].fullName));
                            for (iii = 0; iii < fileNameDupes[ii].length; iii++) {
                                log.add("----> " + File.decode(files[fileNameDupes[ii][iii]].fullName));
                            }
                            continue loopLinks;
                        }
                        // Found a match.
                        link.relink(files[ii]);
                        link.update();
                        count++;
                        continue loopLinks;
                    }
                }
            }
    }

    function processFolder() {
        var doc;
        var file;
        var files;
        var i;
        progress.display1("Reading folder...");
        files = getFiles(folderInput, cbSubfolders.value, "indd");
        if (!files.length) {
            doneMessage = "No files found in selected folder";
            return;
        }
        progress.set1(files.length);
        for (i = 0; i < files.length; i++) {
            file = files[i];
            try {
                doc = app.open(file);
            } catch (_) {
                log.addFile(file.fullName, "Cannot open the file.");
                continue;
            }
            processDoc(doc);
            doc.save();
            doc.close(SaveOptions.NO);
        }
    }

    function processOpenDocs() {
        var i;
        progress.set1(app.documents.length);
        for (i = 0; i < app.documents.length; i++) {
            processDoc(app.documents[i]);
        }
    }

})();
