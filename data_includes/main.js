PennController.DebugOff();
PennController.ResetPrefix(null);

Sequence("BrowserWarning","Consent", "Counter", "BackgroundInfo", "LoadExperiment", "PreloadVids", "TrainingInstruct", "TrainingPhase", "TestInstruct", randomize("TestPhase"),  "DebriefQuestions", SendResults(),"EndScreen");

newTrial("BrowserWarning",
    defaultText
    .center()
    .css("font-size", "24px")
    .cssContainer({"margin-bottom":"1em"})
    .print()
    ,
    newText("REMINDER!")
    .css("font-size", "36px")
    ,
    newText("Use Chrome! This experiment <i><b>will not load</b></i> on a tablet or mobile device.")
    ,
    newButton("Proceed", "Proceed")
    .center()
    .print()
    .wait()
    );

newTrial("Consent",
    newText("InclusionCriteria", "By entering your ProlificID you agree that: <p><b>You are at least 18 years of age and a native speaker of English.</b></p>")
    .center()
    .css("font-size", "24px")
    .print()
    ,
    newTextInput("ProlificID")
    .center()
    .print()
    .log()
    ,
    newButton("Proceed")
    .center()
    .print()
    .wait()
    ,
    getText("InclusionCriteria")
    .remove()
    ,
    getTextInput("ProlificID")
    .remove()
    ,
    getButton("Proceed")
    .remove()
    ,
    newImage("Consent","https://mondo1.dreamhosters.com/ProlificOnlineConsent_English.jpg")
    .size(1000)
    .print()
    .center()
    ,
    newCanvas("agree", 800, 400)
    .add(200, 0, newButton("Agree", "I agree"))
    .add(400, 0, newButton("Disagree", "I do NOT agree"))
    .center()
    .print()
    ,
    newSelector("consentselect")
    .add(getButton("Agree"), getButton("Disagree"))
    .settings.log("all")
    .wait()
    ,
    getSelector("consentselect")
    .test.selected(getButton("Agree"))
    .success(
        getImage("Consent")
        .remove()
        ,
        getSelector("consentselect")
        .remove()
        ,
        getCanvas("agree")
        .remove()
        )
    .failure(
        getImage("Consent")
        .remove()
        ,
        getSelector("consentselect")
        .remove()
        ,
        getCanvas("agree")
        .remove()
        ,
        newText("Exit", "You may exit the experiment by closing the window. Thank you for your consideration.")
        .print()
        .center()
        .css({"font-size": "24px"})
        .wait()
        )
    ,
    newVar("ParticipantID").global()
    .set(getTextInput("ProlificID"))
)

SetCounter("Counter", "inc", 1);

newTrial("BackgroundInfo",
    defaultText
    .css("font-size", "18px")
    .center()
    .print()
    ,
    newText("ListLanguages", "<b>In addition to English</b>, what other languages do you speak? <p> Use the boxes below to tell us which languages you speak and then use the scale to indicate how well you speak each language. If you speak more than four languages, just list the four that you know best.</p>")
    ,
    newCanvas("LanguageProficiency", 600, 300)
    .center()
    .add(0,0,
        newTextInput("Lang1")
        .log()
        .size(200, 24)
        )
    .add("center at 75%", 0,
        newScale("Lang1Scale", 5)
        .center()
        .log()
        .before(newText("Very Basic  "))
        .after(newText("  Native Speaker"))
        )
    .add(0,"middle at 25%",
        newTextInput("Lang2")
        .log()
        .size(200, 24)
        )
    .add("center at 75%", "middle at 25%",
        newScale("Lang2Scale", 5)
        .center()
        .log()
        .before(newText("Very Basic  "))
        .after(newText("  Native Speaker"))
        )
    .add(0,"middle at 50%",
        newTextInput("Lang3")
        .log()
        .size(200, 24)
        )
    .add("center at 75%", "middle at 50%",
        newScale("Lang3Scale", 5)
        .center()
        .log()
        .before(newText("Very Basic  "))
        .after(newText("  Native Speaker"))
        )
    .add(0,"middle at 75%",
        newTextInput("Lang4")
        .log()
        .size(200, 24)
        )
    .add("center at 75%", "middle at 75%",
        newScale("Lang4Scale", 5)
        .center()
        .log()
        .before(newText("Very Basic  "))
        .after(newText("  Native Speaker"))
        )
    .print()
    ,
    newButton("Continue")
    .center()
    .print()
    .wait()
    .remove()
    ,
    getCanvas("LanguageProficiency")
    .remove()
    ,
    getText("ListLanguages")
    .remove()
    ,
    newText("SignExperience", "How much experience have you had with any Sign Language?<p>")
    ,
    newScale("SignScale", 5)
    .center()
    .before(newText("I don't know it at all  "))
    .after(newText("  I'm a native signer"))
    .print()
    .log()
    .wait()
).log("ParticipantID", getVar("ParticipantID"));

newTrial("LoadExperiment",
  newText("LoadingInfo", "The experiment will load as soon as you press 'Continue'. This should not take more than 3 minutes! </p>")
  .center()
  .css("font-size", "24px")
  .cssContainer({"margin-bottom":"1em"})
  .print()
  ,
  newButton("Continue")
  .center()
  .print()
  .wait()
);

PreloadZip("https://mondo1.dreamhosters.com/IteratedLearning_RepeatedItemsVersion.zip");

PennController.CheckPreloaded(3*60*1000) // wait up to 2 minutes for preload
    .label("PreloadVids");


newTrial("TrainingInstruct",
    newText("TrainingHeader", "PART 1")
    .center()
    .bold()
    .css("font-size", "24px")
    .cssContainer({"margin-bottom":"1em"})
    .print()
    ,
    newText("TrainingInstructions", "You will see an action and then some gesture videos describing that action. <p><b>Watch the gesture videos carefully! You'll be asked about them later!</b></p>")
    .center()
    .css("font-size", "24px")
    .cssContainer({"margin-bottom":"1em"})
    .print()
    ,
    newButton("Continue")
    .center()
    .print()
    .wait()
    ,
    getText("TrainingInstructions")
    .remove()
);

Template("TrainingItems.csv" , row =>
    newTrial("TrainingPhase",
        newVideo("ActionVid", row.ActionVidFilename)
        .size(500)
        .disable(.01)
        .center()
        .print()
        ,
        newTimer(2500) //delay video start by 2500ms
        .start()
        .wait()
        ,
        getVideo("ActionVid")
        .play()
        .wait()
        ,
        newButton("Next", "Next")
        .print()
        .center()
        .wait()
        .remove()
        ,
        getVideo("ActionVid")
        .remove()
        ,
        newVideo("GestureVid", row.GestureVidFilename)
        .size(500)
        .disable(.01)
        .center()
        .print()
        .play()
        .wait()
        ,
        getButton("Next")
        .print()
        .center()
        .wait()
        .remove()
    )
.log("ParticipantID", getVar("ParticipantID"))
.log("ListID", row.group)
.log("ItemID", row.ItemID)
.log("TrainingOrder", row.TrainingOrder)
.log("AdjType", row.AdjType)
.log("ConditionID", row.ConditionID)
.log("DominantOrder", row.DominantOrder)
);

newTrial("TestInstruct",
    newText("TestHeader", "PART 2")
    .center()
    .bold()
    .css("font-size", "24px")
    .cssContainer({"margin-bottom":"1em"})
    .print()
    ,
    newText("TestPhaseInstructions", "You will see two gesture videos. <b>Click on the gesture that you think best describes the event.</b> If you are unsure, take your best guess.")
    .center()
    .css("font-size", "24px")
    .print()
    ,
    newButton("Continue")
    .center()
    .print()
    .wait()
);

Template("TestItems.csv" , row =>
      newTrial("TestPhase",
        newVideo("ActionVid",row.ActionVidFilename)
        .size(500)
        .print()
        .center()
        .disable(.01)
        .play()
        .wait()
        ,
        newTimer("afterAction", 1000)
        .start()
        .wait()
        ,
        getVideo("ActionVid")
        .remove()
        ,
        newText("Click on the gesture video that best describes the event.")
        .center()
        .css("font-size", "24px")
        .print()
        ,
        newCanvas("SidebySide", 1050, 500)
        .add(0,0,
          newVideo("NounFirstVideo", row.NounFirstFile)
          .size(500)
          .disable(.01)
        )
        .add(550, 0,
          newVideo("NounLastVideo", row.NounLastFile)
          .size(500)
          .disable(.01)
        )
        .center()
        .print()
        .log()
        ,
        newTimer(500) //delay video start by 500ms
        .start()
        .wait()
        ,
        newVar("loop", true) //Create new variable with default value "true"
        ,
        newTimer("loop", 1000) //Adjust time between loops
        .callback(getVar("loop").test.is(true) // Evaluates this part when timer runs out
            .success( //As long as the loop variable = true (always), then will do the following
            getVideo("NounFirstVideo").play()
            ,
            getVideo("NounLastVideo").play()
            ,
            getTimer("loop").start() // to start the loop over again
            )
        )
        .start() //starts loop timer first time
        ,
        newSelector("SelectVid")
        .add(getVideo("NounFirstVideo"), getVideo("NounLastVideo"))
        .shuffle()
        .once()
        .wait()
        .log()
        ,
        getVar("loop").set(false) //after selection is made, changes "loop" variable value to false to end loop
        ,
        getVideo("NounFirstVideo").stop()
        ,
        getVideo("NounLastVideo").stop()
    )
.log("ParticipantID", getVar("ParticipantID"))
.log("ListID", row.group)
.log("ItemID", row.ItemID)
.log("AdjType", row.AdjType)
.log("ConditionID", row.ConditionID)
.log("DominantOrder", row.DominantOrder)
.log("NounFirstOrder", row.NounFirstOrder)
.log("NounLastOrder", row.NounLastOrder)
);

newTrial("DebriefQuestions",
    defaultText
    .center()
    .css("font-size", "24px")
    .cssContainer({"margin-bottom":"1em"})
    .print()
    ,
    newText("RateDifficulty", "How easy or difficult was this experiment to you?")
    ,
    newScale("Difficulty", 7)
        .before(newText("Extremely Easy  "))
        .after(newText("  Extremely Hard"))
        .center()
        .print()
        .log()
        .cssContainer({"margin-bottom":"1em"})
    ,
    newText("Comments", "Feel free to enter any comments in the box below:")
    ,
    newTextInput("CommentBox")
        .length(45)
        .lines(5)
        .center()
        .print()
        .log()
        .cssContainer({"margin-bottom":"1em"})
    ,
    newButton("End Experiment")
        .center()
        .print()
        .wait()
    ).log("ParticipantID", getVar("ParticipantID"));

SendResults();

newTrial("EndScreen",
    newText("<p><a href='https://app.prolific.co/submissions/complete?cc=3A9135BA'>Click here to validate your submission</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
).setOption("hideProgressBar",true);
