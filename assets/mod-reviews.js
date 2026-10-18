/* ============================================================================
   Bigtornado reviews mods: the data behind the reviews section.

   Only you can add or change reviews: this file lives in your GitHub repo, and
   only accounts with push access to Bigtornadooo/personal-website can change
   it. Everyone else can read the published page, nobody else can edit it.

   To add a review: copy the TEMPLATE at the bottom into the list below, fill
   it in, commit and push. GitHub Pages updates the site in about a minute.
   The section stays hidden until at least one review is in the list.

   Fields
     code, title      Module code and full title.
     taken            When you took it, e.g. "AY2025/26 Sem 1".
     mcs              Units (MCs).
     grade            Optional. Leave it out if you would rather not say.
     verdict          One honest line. Shown on the collapsed row.
     review           One or more paragraphs, as a list of strings.
     ratings          1 to 5 each. workload: how heavy. difficulty: how hard.
                      worth: how much it was worth taking.
     components       The assessment breakdown. weight is a percentage and the
                      weights should add up to 100. note is your take on that
                      component: how hard it really was, how to approach it.
     takeIf, skipIf   Who should take it, who should not.
     tips             Short, concrete tips for juniors.
     updated          Date you last edited the review, YYYY-MM-DD.
   ========================================================================== */
window.MOD_REVIEWS = [
  {
    "code": "MA1522",
    "title": "Linear Algebra for Computing",
    "taken": "AY2025/26 Sem 1",
    "mcs": 4,
    "grade": "A",
    "verdict": "Do not give up. The comeback is extremely possible for this mod.",
    "review": [
      "Projected grade was a B+, final grade was an A. I was assigned L2, but watched every one of Prof Jon Teo's lectures as well.",
      "PSA: this is for anyone looking for a little bit of solace in case you did badly for midterms or still don't know what is going on. I won't go into the details of the course, there are loads of comments already.",
      "Getting below the LQ for midterms was quite a crushing feeling. It was my first time failing math in a long while, and seeing all my friends get above median (some even 11/15 and above) really got me thinking: was I really that stupid?",
      "After reflecting post midterms, I realised that the strategy I used for A Levels (aka cram past year papers) was never going to work, because it can't be replicated for this course. The questions really test your understanding of Linear Algebra rather than the process to get to the answer. This course tests your instincts and the nuances of Linear Algebra, as I would like to describe it.",
      "Post midterms, I changed my working style: I learned to really understand each topic, and watched every attached YouTube video and more to get a feel of what each function does and its purpose. Towards the end of the course, if you really try, it will make sense, de trust!"
    ],
    "components": [
      {
        "name": "Midterm",
        "score": "5.83 / 15",
        "note": "Median was about 7.5 and the LQ about 6.5, if I remember right."
      },
      {
        "name": "Finals",
        "score": "Not disclosed",
        "note": "Counting my MCQ, it should be about 28.5 / 30."
      },
      {
        "name": "Assignments and quizzes",
        "score": "Full marks",
        "note": ""
      }
    ],
    "tips": [
      "Don't cram past year papers like for A Levels. Understand each topic properly.",
      "Watch the attached YouTube videos (and more) to get a feel for what each function does and why.",
      "Do sparring sessions with an AI like ChatGPT: keep asking questions to clear your doubts, and ask why your working towards an answer doesn't work.",
      "Many people taking this mod have the S/U mentality, so capitalise on this!",
      "Do not give up. Albeit a lot of hair will be dropped."
    ],
    "updated": "2026-10-18"
  },
  {
    "code": "CS1010A",
    "title": "Programming Methodology",
    "taken": "AY2025/26 Sem 1",
    "mcs": 4,
    "grade": "A",
    "verdict": "This mod requires a lot of attention to detail.",
    "review": [
      "Going into midterms, my strategy was to do many papers and then look at the answer key. Maybe it was my brain being super lazy after NS, but I would just glance through the solutions and think \"oh, I got it\" when in fact I didn't. I never thought to draw the box and pointer diagrams, and never thought to actually redo the solutions. I thought the brute force method of just doing papers would suffice, which led to my subpar midterm score.",
      "Heading into the practical, I did my due diligence of understanding the solutions. But I was unlucky and careless on the first question, which was really easy and worth about 5 marks. The solution was just a basic Fibonacci, but I wrote a simple recursion that passed all the given test cases without accounting for other cases, like higher values of n. I got 2/5 for it, losing precious marks that could have bumped me to the upper quartile.",
      "Those failures from the practical and midterms lit a fire under me. I would not only do practice papers, but take equal time to do the corrections as well, using AI to validate and check my solutions and slowly break down each mistake I made."
    ],
    "components": [
      {
        "name": "Midterm",
        "score": "31 / 60",
        "note": "Upper quartile 35, median 28, if I remember right. There was progressive grading."
      },
      {
        "name": "Practical",
        "score": "13.5 / 20",
        "note": "Upper quartile 16, median 14, if I remember right."
      },
      {
        "name": "Finals",
        "score": "88 / 100",
        "note": "Upper quartile 80, median 75, if I remember right."
      }
    ],
    "tips": [
      "Draw the box and pointer diagrams, and actually redo the solutions instead of just glancing through them.",
      "Test your code beyond the given test cases (for example, larger values of n).",
      "Spend as much time on corrections as on the paper itself. Sometimes reviewing the solutions takes longer than doing the paper, and that's fine.",
      "Mental hack: put \"do the paper\" and \"review the solutions\" as two separate checkboxes on your to-do list, so each one is a task of its own."
    ],
    "updated": "2026-10-18"
  },
  {
    "code": "BT1101",
    "title": "Introduction to Business Analytics",
    "taken": "AY2025/26 Sem 1",
    "mcs": 4,
    "grade": "A-",
    "verdict": "Really one of those mods that tests whether or not you want to stay in BZA.",
    "review": [
      "This module was really a lot. Out of my three core mods, I always saw this as my likeliest A, since my TA commented that I was one of the highest for the midterm. Sadly it didn't happen. I believe my finals MCQ was near full marks, but I had a lot of problems with my R. Due to time constraints I focused on doing the paper instead of following the formatting in the template. I didn't manage to finish the finals and left about 6 marks blank, same as a lot of people.",
      "As an intro to BZA mod, looking back I do see its purpose, but the way they threw all that content at us was a bit crazy. And don't get me started on the midterm being in week 9 testing week 1 to 6 content, which led to a serious backlog of week 7 onwards.",
      "Overall I liked the content. A lot of it was very interesting, and taking Linear Algebra at the same time really opened my eyes to the world of machine learning: how so many vector variables can use regression to create a best fit line, PCA, and so on. I know a lot of people struggle in this mod, but if you stay interested in the content and actually go and source YouTube videos to understand how the different mechanisms work, I think you'll be fine."
    ],
    "components": [
      {
        "name": "Midterm",
        "score": "25 / 30",
        "note": "Upper quartile 23, median 20, if I remember right."
      },
      {
        "name": "Assignments",
        "score": "3 full marks",
        "note": "I forget the rest."
      },
      {
        "name": "Finals",
        "score": "Not known",
        "note": "MCQ probably near full marks, but I struggled with the R section and left about 6 marks blank."
      }
    ],
    "tips": [
      "The midterm is in week 9 and tests weeks 1 to 6, so don't let week 7 onwards pile up.",
      "Get comfortable with R before the finals. That is where I ran out of time.",
      "Source YouTube videos to understand how the different mechanisms (regression, PCA and so on) actually work."
    ],
    "updated": "2026-10-18"
  },
  {
    "code": "IS1108",
    "title": "Digital and AI Ethics",
    "mcs": 4,
    "grade": "A-",
    "verdict": "Terrible mod all around, the epitome of formal education: a prerequisite you clear just to get a degree.",
    "review": [
      "Lowkey forgot what I got for most of my grades, but this was a terrible mod all around. Really bad mod, the epitome of formal education where you need to clear prerequisites just to get a degree. Got lucky to get an A- I guess."
    ],
    "components": [
      {
        "name": "Midterm",
        "score": "21 / 30",
        "note": "Upper quartile 23, median 21, if I remember right."
      },
      {
        "name": "Group project",
        "score": "Upper",
        "note": ""
      }
    ],
    "updated": "2026-10-18"
  },
  {
    "code": "IS2218",
    "title": "Digital Platforms for Business",
    "taken": "AY2025/26 Sem 1",
    "mcs": 4,
    "grade": "B+",
    "verdict": "An eye opener for how the unstructured learning of university can haunt you.",
    "review": [
      "This mod was an eye opener for me, as I found out how the unstructured learning of university could haunt somebody. Coming in, the practices the Professor gave us made me think this would be an easy module lmaoooo. However, I found out the hard way during midterms that most people taking this mod have already taken ACC1701, a more in-depth accounting course from the business school itself. I was severely underprepared and found myself shitting the bed when I opened the first question of the midterms LOLLL.",
      "Luckily my finals were slightly above median, which helped me recover to a B+. Be prepared that the practices will not tally with the actual paper. The grading distribution is also a bit weird: my friend who got 9 and 12 got a B, and my friend who got 12 and 16 got an A-.",
      "The whole course is basically out of 40 marks, split into two 1 hr Examplify papers, sprinkled with a few assignments here and there, and recorded lectures with no tutorials. Great for freeing up your timetable."
    ],
    "components": [
      {
        "name": "Midterm",
        "score": "9 / 20",
        "note": "Median 12, if I remember right."
      },
      {
        "name": "Finals",
        "score": "13 / 20",
        "note": "Median 11, if I remember right."
      },
      {
        "name": "Assignments",
        "score": "Full marks",
        "note": "Should all be full marks."
      }
    ],
    "tips": [
      "Most people taking this mod have already done ACC1701. If you haven't, prepare beyond the given practices.",
      "The practices will not tally with the actual paper.",
      "It's two 1 hr Examplify papers out of 40 marks, recorded lectures and no tutorials, so it frees up your timetable."
    ],
    "updated": "2026-10-18"
  }
];

/* TEMPLATE (copy into the list above, then fill in):
  {
    code: "CS2040",
    title: "Data Structures and Algorithms",
    taken: "AY2026/27 Sem 1",
    mcs: 4,
    grade: "",
    verdict: "",
    review: [
      "",
    ],
    ratings: { workload: 3, difficulty: 3, worth: 3 },
    components: [
      { name: "Final exam", weight: 40, note: "" },
      { name: "Midterm", weight: 20, note: "" },
      { name: "Labs", weight: 20, note: "" },
      { name: "Problem sets", weight: 20, note: "" },
    ],
    takeIf: "",
    skipIf: "",
    tips: [
      "",
    ],
    updated: "2026-12-10",
  },
*/
