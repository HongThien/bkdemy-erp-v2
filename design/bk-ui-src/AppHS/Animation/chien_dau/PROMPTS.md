# Bộ prompt ImageGen chiến đấu

Công cụ: ImageGen tích hợp. Mỗi tư thế / mỗi FX là một lần sinh riêng, không cắt sprite sheet. Nam/nữ dùng ảnh tham chiếu nhân vật tương ứng.

## Prompt chung nhân vật

Reference role: exact identity/style from existing male/female run kit. Generate each pose separately; anime fantasy hand-painted chibi, brown hair, green-gold cape, ivory tunic, brown leather belt/cuffs/boots. Face RIGHT, preserve costume, proportions and palette. 1024x1536 RGBA transparent, full body, no cropped hands/hair/cape, body standing height78%, ground94%, axis50%, no text/shadow/aura/extra objects/magic in character.

## 15 tư thế · áp dụng cho cả Nam và Nữ

- **dung_1**: Combat neutral stance, feet lightly apart, relaxed guarded hands near waist, gentle exhalation, calm alert face
- **dung_2**: Same combat idle stance as dung_1, inhalation with shoulders/chest subtly raised, cape lifted slightly; subtle change only
- **suy_nghi**: Thoughtful pose: finger rests on cheek/chin, eyes look upward-right, curious contemplative expression, weight shifts onto one leg; no question mark
- **tich_nang_1**: Gather energy: hands together before chest, body crouches slightly, eyes closed in intense concentration, cape starts lifting. No visible energy effect
- **tich_nang_2**: Stronger charging: torso bends forward, two open cupped hands surround a ROUND EMPTY SPACE in front of chest. Eyes open focused, hair and cape whipped backward/upward. EMPTY between palms, no orb
- **niem_troi_1**: Sky-cast preparation: ONE arm raised pointing overhead, torso leans slightly backward, face looks up-right, other hand near chest
- **niem_troi_2**: Strong sky spell release: BOTH arms fully extended high overhead, both open hands visible, face tilted upward-right, mouth shouting, cape flares energetically. No lightning or meteor
- **nem_truoc_1**: Throw wind-up like baseball pitcher: torso twists, throwing arm pulled far BACK toward LEFT, weight on back leg, other hand forward balancing, face determined RIGHT, cape follows twist
- **nem_truoc_2**: Powerful forward throw RIGHT: one arm FULLY straight horizontally RIGHT with open palm, torso lunges forward-right, front leg takes long step, back leg extends, cape flies LEFT, fierce focused face. Nothing in hand, no projectile or effects
- **phat_nho**: Relaxed small spell flick RIGHT: torso upright, one arm horizontal toward right, fingers in snapping/flicking gesture, casual confident face, mild cape motion. No lightning or projectile
- **bi_danh_1**: Hit recoil: torso jerks backward LEFT, eyes squeezed shut and painful grimace, arms lift protectively toward right, cape thrown forward RIGHT by impact. No impact flash or object
- **bi_danh_2**: Strong knockback: whole body leaning far backward LEFT almost falling, ONE leg lifts clear of ground, face painfully grimacing still oriented RIGHT, arms flail forward for balance, cape flung forward. No external effects
- **guc**: Defeated collapsed pose: knees on ground and one hand supports on ground, slumped body, head hangs down toward right, eyes closed exhausted. Keep same character physical scale, don't enlarge crouched body to fill canvas. No circling stars
- **thang_1**: Victory JUMP: BOTH feet visibly lifted above ground baseline y94%, one fist raised overhead, joyful wide smile and happy crescent eyes looking RIGHT, bent legs and flying cape. Keep physical body scale same as standing, preserve full raised fist within canvas
- **thang_2**: Victory landing: feet grounded baseline, jaunty celebratory V-sign or fist, face winks and big joyful smile toward RIGHT, cape fluttering, full body energetic victory pose

## Hiệu ứng và nền

- fx_cau_lua: transparent fireball, golden-white core, red-orange flame tail left, head right.
- fx_cau_bang: transparent iceball, white-cyan core, pointed blue crystals and snow tail left, head right.
- fx_thien_thach: transparent black lava-cracked meteor, head lower-right, flame/smoke tail upper-left.
- fx_dan_ma: transparent boss purple-black magic orb, pink-violet rim, smoky tail left, head right.
- fx_bang_boc: transparent hollow ice crystal enclosure, translucent cyan overlapping shards, white edges, empty inside, no character.
- backdrop_san_dau: purple starry night ancient stone outdoor arena, lantern-lit side columns, distant misty palace; open middle25–75%, floor below62%; no characters/text.

## Sửa riêng niem_troi_2

Edit same character: both arms fully straight vertically upward, palms open high above head, head tilted upward-right shouting, cape billows; complete fingers with margin, transparent background. Preserve face/costume/style.

