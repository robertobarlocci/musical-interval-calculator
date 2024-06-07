document.addEventListener('DOMContentLoaded', (event) => {
    const baseNoteSelect = document.getElementById("baseNote");
    const compareNoteSelect = document.getElementById("compareNote");
    const chordTypeSelect = document.getElementById("chordType");
    const compareChordTypeSelect = document.getElementById("compareChordType");
    const intervalsDiv = document.getElementById("intervals");
    const showIntervalsButton = document.getElementById("showIntervals");

    const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const intervalNames = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "#5", "6", "b7", "7"];

    // Populate all note dropdowns
    for (const select of [baseNoteSelect, compareNoteSelect]) {
        notes.forEach(note => {
            const option = document.createElement('option');
            option.value = note;
            option.text = note;
            select.add(option);
        });
    }

    showIntervalsButton.addEventListener("click", () => {
        const baseNote = baseNoteSelect.value;
        const compareNote = compareNoteSelect.value;
        const chordType = chordTypeSelect.value;
        const compareChordType = compareChordTypeSelect.value;

        try {
            const baseChordNotes = getChordNotes(baseNote, chordType);
            const compareChordNotes = getChordNotes(compareNote, compareChordType);
            const baseIntervals = getIntervals(baseChordNotes, baseNote);
            const compareIntervals = getIntervals(compareChordNotes, baseNote);
            displayChordIntervals(baseChordNotes, baseIntervals, compareChordNotes, compareIntervals);
        } catch (error) {
            intervalsDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    });

    function getChordNotes(rootNote, chordType) {
        const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
        const rootIndex = notes.indexOf(rootNote);
        if (rootIndex === -1) {
            throw new Error(`Invalid note: ${rootNote}`);
        }

        const intervals = {
            major: [0, 4, 7],
            minor: [0, 3, 7],
            augmented: [0, 4, 8],
            diminished: [0, 3, 6]
        };

        if (!intervals.hasOwnProperty(chordType)) {
            throw new Error(`Invalid chord type: ${chordType}`);
        }

        return intervals[chordType].map(offset => notes[(rootIndex + offset) % 12]);
    }

    function getIntervals(chordNotes, baseNote) {
        const baseNoteIndex = notes.indexOf(baseNote);
        return chordNotes.map(note => {
            let interval = (notes.indexOf(note) - baseNoteIndex + 12) % 12;
            return intervalNames[interval]; // Use intervalNames for accurate labels
        });
    }

    function displayChordIntervals(baseChordNotes, baseIntervals, compareChordNotes, compareIntervals) {
        intervalsDiv.innerHTML = '';

        const maxIntervals = Math.max(baseIntervals.length, compareIntervals.length);

        for (let i = 0; i < maxIntervals; i++) {
            const baseInterval = baseIntervals[i] || '-';
            const compareInterval = compareIntervals[i] || '-';

            const intervalElement = document.createElement("p");
            intervalElement.textContent = `Base: ${baseChordNotes[i] || '-'} (${baseInterval}), Compare: ${compareChordNotes[i] || '-'} (${compareInterval})`;
            intervalsDiv.appendChild(intervalElement);
        }
    }
});
