;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Task Scheduling Atomspace and Types
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

!(bind! &tasks (new-space))
!(bind! &schedule (new-space))

(: Task (-> String String String String Number Bool String Type))
(: ScheduledTask (-> String String String String String Type))

(: priority-score (-> String Number))
(= (priority-score "High") 3)
(= (priority-score "Medium") 2)
(= (priority-score "Low") 1)
(= (priority-score $other) 1)

(: time-score (-> String Number))
(= (time-score $startTime) 
   (- 4102444800 (parse-timestamp $startTime)))

(: composite-score (-> String String Number))
(= (composite-score $priority $startTime)
   (if (== $priority "High")
       3000000
       (+ (* (priority-score $priority) 1000000)
          (time-score $startTime))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Scheduling Logic
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(: schedule-tasks (-> String Number Unit))
(= (schedule-tasks $currentTime $availableMinutes)
   (let* (($tasks (match &tasks 
                        (task $id $title $startTime $priority $duration $completed $createdAt)
                        (if (== $completed "false")
                            ($id $title $startTime $priority $duration $createdAt)
                            (empty))))
          ($high-priority (filter (lambda ($t) (== (nth $t 4) "High")) $tasks))
          ($others (filter (lambda ($t) (!= (nth $t 4) "High")) $tasks))
          ($sorted-others (sort-tasks $others))
          ($scheduled (schedule-core $high-priority $sorted-others $currentTime $availableMinutes)))
     ()))

(: sort-tasks (-> List List))
(= (sort-tasks $tasks)
   (let $scored-tasks
        (map (lambda ($t)
                (let* (($id (nth $t 1))
                       ($title (nth $t 2))
                       ($startTime (nth $t 3))
                       ($priority (nth $t 4))
                       ($duration (nth $t 5))
                       ($createdAt (nth $t 6))
                       ($score (composite-score $priority $startTime)))
                  ($score $createdAt $id $title $startTime $priority $duration)))
             $tasks)
     (sort $scored-tasks)))

(: sort (-> List List))
(= (sort ()) ())
(= (sort ($x)) ($x))
(= (sort ($x $y . $rest))
   (if (> (nth $x 1) (nth $y 1))
       (cons $x (sort (cons $y $rest)))
       (if (< (nth $x 1) (nth $y 1))
           (cons $y (sort (cons $x $rest)))
           (if (< (nth $x 2) (nth $y 2))
               (cons $x (sort (cons $y $rest)))
               (cons $y (sort (cons $x $rest)))))))

(: schedule-core (-> List List String Number List))
(= (schedule-core () () $currentTime $availableMinutes) ())
(= (schedule-core ($hp . $hps) $others $currentTime $availableMinutes)
   (let* (($id (nth $hp 1))
          ($title (nth $hp 2))
          ($startTime (nth $hp 3))
          ($priority (nth $hp 4))
          ($duration (nth $hp 5))
          ($hp-start (max-time $currentTime $startTime))
          ($hp-end (add-minutes $hp-start $duration)))
     (if (<= $duration $availableMinutes)
         (let $before-tasks
              (schedule-before $others $currentTime $hp-start $availableMinutes)
           (do (add-atom &schedule (scheduled-task $id $title $hp-start $hp-end $priority))
               (append $before-tasks
                       (cons ($id $title $hp-start $hp-end $priority)
                             (schedule-core $hps 
                                            (remove-scheduled $others $before-tasks)
                                            $hp-end
                                            (- $availableMinutes $duration)))))
         (schedule-core $hps $others $currentTime $availableMinutes))))
(= (schedule-core () $others $currentTime $availableMinutes)
   (schedule-before $others $currentTime $currentTime $availableMinutes))

(: schedule-before (-> List String String Number List))
(= (schedule-before () $currentTime $hpStart $availableMinutes) ())
(= (schedule-before ($t . $ts) $currentTime $hpStart $availableMinutes)
   (let* (($id (nth $t 1))
          ($title (nth $t 2))
          ($startTime (nth $t 3))
          ($priority (nth $t 4))
          ($duration (nth $t 5))
          ($available (time-diff-minutes $hpStart $currentTime)))
     (if (and (<= $duration $available) (<= $duration $availableMinutes))
         (let* (($start (max-time $currentTime $startTime))
                ($end (add-minutes $start $duration)))
           (do (add-atom &schedule (scheduled-task $id $title $start $end $priority))
               (cons ($id $title $start $end $priority)
                     (schedule-before $ts $end $hpStart (- $availableMinutes $duration)))))
         (schedule-before $ts $currentTime $hpStart $availableMinutes))))

(: remove-scheduled (-> List List List))
(= (remove-scheduled $tasks ()) $tasks)
(= (remove-scheduled $tasks ($s . $ss))
   (remove-scheduled (filter (lambda ($t) (!= (nth $t 1) (nth $s 1))) $tasks) $ss))

(: max-time (-> String String String))
(= (max-time $currentTime $startTime)
   (if (time<= $currentTime $startTime)
       $startTime
       $currentTime))

(: add-minutes (-> String Number String))
(= (add-minutes $startTime $minutes) 
   (format-time (+ (parse-timestamp $startTime) (* $minutes 60))))

(: time<= (-> String String Bool))
(= (time<= $t1 $t2) 
   (<= (parse-timestamp $t1) (parse-timestamp $t2)))

(: time-diff-minutes (-> String String Number))
(= (time-diff-minutes $t2 $t1)
   (/ (- (parse-timestamp $t2) (parse-timestamp $t1)) 60))

(: parse-timestamp (-> String Number))
(: format-time (-> Number String))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Utilities
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(: filter (-> (-> $a Bool) List List))
(= (filter $p ()) ())
(= (filter $p ($x . $xs))
   (if ($p $x)
       (cons $x (filter $p $xs))
       (filter $p $xs)))

(: map (-> (-> $a $b) List List))
(= (map $f ()) ())
(= (map $f ($x . $xs)) (cons ($f $x) (map $f $xs)))

(: append (-> List List List))
(= (append () $ys) $ys)
(= (append ($x . $xs) $ys) (cons $x (append $xs $ys)))

(: nth (-> List Number $a))
(= (nth ($x . $xs) 1) $x)
(= (nth ($x . $xs) $n) (nth $xs (- $n 1)))