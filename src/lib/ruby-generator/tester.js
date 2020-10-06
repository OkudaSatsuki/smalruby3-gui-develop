/**
 * Define Tester code generator for Ruby Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    const getUnquoteText = function (block, fieldName, order) {
        const input = block.inputs[fieldName];
        if (input) {
            const targetBlock = Generator.getBlock(input.block);
            if (targetBlock && targetBlock.opcode === 'text') {
                return Generator.getFieldValue(targetBlock, 'TEXT') || '';
            }
        }
        return Generator.valueToCode(block, fieldName, order);
    };

    Generator.init_figure_number = function (block) {
        const figure_number = getUnquoteText(block, 'figure_number', Generator.ORDER_NONE);
        return `require "./${figure_number}.rb"\n`;
    };

    Generator.measure_range_check = function (block) {
        const measure = Generator.getFieldValue(block, 'measure') || null;
        const range_first = getUnquoteText(block, 'range_first', Generator.ORDER_NONE);
        const range_last = getUnquoteText(block, 'range_last', Generator.ORDER_NONE);
        return `#測定値範囲チェック(ohm)\n` +
        `ok, value = ramdump_read(VALUE_${measure})\n` +
        `puts sprintf(“VALUE_${measure}:%d”, value)\n` +
        `exit if ok == false\n` +
        `exit if (value < ${range_first}) or (value > ${range_last})\n`;
    };

    Generator.choose_number = function (block) {
        const choose_number = getUnquoteText(block, 'choose_number', Generator.ORDER_NONE);
        return `#テスト番号${choose_number}を選択する\n` +
        `ok = ramdump_write(TEST_NO, TEST_${choose_number})\n` +
        `exit if ok == false\n` +
        `ok = ramdump_write(DUMP_KEY, KEY_SET)\n` +
        `exit if ok == false\n`;
    };

    Generator.choose_item = function (block) {
        const choose_item = getUnquoteText(block, 'choose_item', Generator.ORDER_NONE);
        return `#テスト内項目${choose_item}へ\n` +
        `ok = ramdump_write(TEST_SUB, ${choose_item})\n` +
        `exit if ok == false\n` ;
    };

    Generator.set_clock = function (block) {
        return `#時計合わせ\n` +
        `nowTime = DateTime.now\n` +
        `year = nowTime.year.to_i - 2000 # scale for ClockIC\n` +
        `month = nowTime.month.to_i\n` +
        `day = nowTime.day.to_i\n` +
        `hour = nowTime.hour.to_i\n` +
        `minute = nowTime.minute.to_i\n` +
        `ok = ramdump_write(EDIT_CLK_YEAR, year)\n` +
        `exit if ok == false\n` +
        `ok = ramdump_write(EDIT_CLK_MONTH, month)\n` +
        `exit if ok == false\n` +
        `ok = ramdump_write(EDIT_CLK_DAY, day\n` +
        `exit if ok == false\n` +
        `ok = ramdump_write(EDIT_CLK_HOUT, hour)\n` +
        `exit if ok == false\n` +
        `ok = ramdump_write(EDIT_CLK_MIN, minute)\n` +
        `exit if ok == false\n`;
    };

    Generator.test_mode = function (block) {
        return `#テストへ投入する\n` +
        `ok = ramdump_write(FLG_MAIN KEY, 2)\n` +
        `exit if ok == false\n`;
    };

    return Generator;
}