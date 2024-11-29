import { getSettings } from "../js/utils/browser"
import Client from "../js/api/Client"

const replaceInNodes = (nodes) => {
  if (nodes && nodes.length > 0) {
    // clearInterval(poller)
    for (const activity of nodes) {
      // if there is already a link inside the activity, skip
      if (activity.querySelector("a") !== null) {
        continue
      }

      const text = activity.textContent
      const wordMatchRegExp = new RegExp(`((?<!([A-Z]{1,10})-?)[A-Z]+-\\d+)`, "ig")
      const matches = text.matchAll(wordMatchRegExp)
      if (matches.length <= 0) {
        continue
      }

      for (const match of matches) {
        const word = match[0]
        const link = document.createElement("a")
        link.href = `https://protofy.atlassian.net/browse/${word}`
        link.rel = "noopener noreferrer"
        link.target = "_blank"
        link.textContent = word
        activity.innerHTML = activity.innerHTML.replace(word, link.outerHTML)
      }
    }
  }
}

const submitAllCalendar = async function () {
  const tableBody = document.querySelector(".section .banner table tbody")
  const rows = tableBody.querySelectorAll("tr:not(._calendar-injection)")
  const projectId = document.querySelector('input[name="projectId"]').value
  const taskId = document.querySelector('input[name="taskId"]').value
  const data = []
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td")

    const checkBox = cells[4].querySelector("input")
    const checked = checkBox.checked
    if (!checked) {
      return
    }

    let currentDate = document.querySelector(".tst-current-week li span.current")
    console.log(currentDate)
    let dateClassName = [...currentDate.classList.values()].find((c) => c.startsWith("tst-date-"))
    const date = dateClassName.split(/tst-date-/)[1]
    const time = cells[1].textContent
    const [hours, minutes] = time.split(":")
    const seconds = parseInt(hours) * 3600 + parseInt(minutes) * 60
    const description = cells[2].textContent
    data.push({
      date: date,
      seconds: seconds,
      description: description,
      project_id: projectId,
      task_id: taskId,
    })
  })

  console.log(data)
  await pushActivities(data)
}

const dropbox =
  '<td class="first"><div class="tst-project-id"><div><div class="w-100 css-b62m3t-container"><span id="react-select-4-live-region" class="css-7pg0cj-a11yText"></span><span aria-live="polite" aria-atomic="false" aria-relevant="additions text" role="log" class="css-7pg0cj-a11yText"></span><div class="tst-react-select__control css-1flhem5-control"><div class="tst-react-select__value-container css-l7ugr5"><div class="tst-react-select__placeholder css-1p323k2-placeholder" id="react-select-4-placeholder">Bitte wählen ...</div><div class="tst-react-select__input-container css-1lsiksa" data-value=""><input class="tst-react-select__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-4-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="false" aria-haspopup="true" role="combobox" aria-describedby="react-select-4-placeholder" value="" style="color: inherit; background: 0px center; opacity: 1; width: 100%; grid-area: 1 / 2; font: inherit; min-width: 2px; border: 0px; margin: 0px; outline: 0px; padding: 0px;"></div></div><div class="tst-react-select__indicators css-1wy0on6"><span class="tst-react-select__indicator-separator css-pms0mz-indicatorSeparator"></span><div class="tst-react-select__indicator tst-react-select__dropdown-indicator css-s6708v-indicatorContainer" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div></div><input name="projectId" type="hidden" value=""></div></div></div><div class="tst-task-id mt-[3px]"><div><div class="w-100 tst-react-select--is-disabled css-3iigni-container"><span id="react-select-5-live-region" class="css-7pg0cj-a11yText"></span><span aria-live="polite" aria-atomic="false" aria-relevant="additions text" role="log" class="css-7pg0cj-a11yText"></span><div class="tst-react-select__control tst-react-select__control--is-disabled css-fykp5l-control" aria-disabled="true"><div class="tst-react-select__value-container css-l7ugr5"><div class="tst-react-select__placeholder css-wki0qw-placeholder" id="react-select-5-placeholder">Bitte wählen ...</div><div class="tst-react-select__input-container css-bxogpf" data-value=""><input class="tst-react-select__input" disabled="" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-5-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="false" aria-haspopup="true" role="combobox" aria-describedby="react-select-5-placeholder" value="" style="color: inherit; background: 0px center; opacity: 1; width: 100%; grid-area: 1 / 2; font: inherit; min-width: 2px; border: 0px; margin: 0px; outline: 0px; padding: 0px;"></div></div><div class="tst-react-select__indicators css-1wy0on6"><span class="tst-react-select__indicator-separator css-pms0mz-indicatorSeparator"></span><div class="tst-react-select__indicator tst-react-select__dropdown-indicator css-1rdlqlp-indicatorContainer" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div></div></div></div></div></td>'
const projectInput =
  '<td>Project: <input name="projectId" type="text" value=""></td><td>Task: <input name="taskId" type="text" value=""></td><td></td><td></td><td><button type="button" class="_calendar-injection_button-submit-all">Submit All</input></td>'

const pushActivities = async (activities) => {
  if (activities.length === 0) {
    return
  }

  const settings = await getSettings()
  const client = new Client(settings)

  await fetch("/api/v1/activities/bulk", {
    method: "POST",
    headers: {
      Authorization: `Token token=${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activities: activities
    }),
  })
}

const injectForCalendar = () => {
  const calendarContainer = document.querySelector(".section .banner")
  if (!calendarContainer) {
    return
  }
  let tableBody = calendarContainer.querySelector("table tbody")
  if (!tableBody) {
    return
  }

  if (tableBody.querySelector("tr._calendar-injection") !== null) {
    return
  }

  const dropboxLine = document.createElement("tr")
  dropboxLine.className = "_calendar-injection"
  dropboxLine.innerHTML = `${projectInput}`
  tableBody.prepend(dropboxLine)
  tableBody
    .querySelector("button._calendar-injection_button-submit-all")
    .addEventListener("click", async () => {
      await submitAllCalendar()
    })

  tableBody.querySelectorAll("tr:not(._calendar-injection)").forEach((row) => {
    const checkBoxCell = document.createElement("td")
    checkBoxCell.innerHTML = '<input type="checkbox">'
    row.append(checkBoxCell)
  })
}

const poller = setInterval(function () {
  let activities = document.querySelectorAll(".tst-activities .activity-row .third div")
  replaceInNodes(activities)
  activities = document.querySelectorAll("tr.tst-timesheet-activity span[title]")
  replaceInNodes(activities)

  injectForCalendar()
}, 100)
