require "pry"
require "frequency_analyser"
require "open3"
require "numbers_in_words"
require "numbers_in_words/duck_punch"

binary, filename, seed_prefix, seed_after_first, seed_before_last = ARGV
original_dimacs = File.read(filename).split("\n")

def parse_mappings(dimacs)
  lines = dimacs.select { |line| line.include?("->") }

  mappings = lines.map do |line|
    line = line.gsub("c ", "")
    integer, variable = line.split(" -> ")
    [variable, Integer(integer)]
  end

  Hash[mappings]
end

def seed_frequencies(seed)
  frequencies = FrequencyAnalyser.analyse(seed)

  ("a".."z").each do |letter|
    frequencies.merge!(letter => 0) unless frequencies.key?(letter)
  end

  frequencies
end

def to_binary(number)
  binary = number.to_s(2)
  binary = "000000" + binary
  binary = binary[-6..-1]

  array = binary.split("")
  array = array.map { |element| element == "1" ? true : false }
  array.reverse
end

def to_numbers(variables)
  ("a".."z").map do |letter|
    (1..2).map do |sf|
      bits = variables.select do |k, _|
        k.start_with?(letter) && k.include?("sf#{sf}")
      end
      bits = bits.sort_by { |k, _| k }

      total = 0
      bits.each.with_index do |(_, bool), index|
        total += 2 ** index if bool
      end
      total
    end
  end
end

def seed_variables_for_letter(letter, number)
  binary = to_binary(number)

  array = 6.times.map do |i|
    ["seed_#{letter}#{i}", binary[i]]
  end

  Hash[array]
end

def seed_variables(seed)
  frequencies = seed_frequencies(seed)

  frequencies.each.with_object({}) do |(letter, number), hash|
    variables = seed_variables_for_letter(letter, number)
    hash.merge!(variables)
  end
end

def variables(original_dimacs, assignments)
  mappings = parse_mappings(original_dimacs)
  variables = {}

  ("a".."z").each do |letter|
    (1..2).each do |sf|
      (0..5).each do |bit|
        next if sf > 1 && bit > 3

        variable = "#{letter}_sf#{sf}_#{bit}"
        literal = mappings.fetch(variable)

        if assignments.include?(literal)
          variables.merge!(variable => true)
        else
          variables.merge!(variable => false)
        end
      end
    end
  end

  variables
end

def seed_dimacs(dimacs, seed_prefix, seed_after_first, seed_before_last)
  seed = seed_prefix + seed_after_first + seed_before_last

  variables = seed_variables(seed)
  mappings = parse_mappings(dimacs)

  literals = variables.map do |letter, boolean|
    literal = mappings.fetch(letter)
    boolean ? literal : literal * -1
  end

  literals.map { |l| "#{l} 0" }
end

def generate_dimacs(original_dimacs, seed_prefix, seed_after_first, seed_before_last)
  additional_dimacs = seed_dimacs(original_dimacs, seed_prefix, seed_after_first, seed_before_last)
  dimacs = original_dimacs + additional_dimacs

  _, _, literals, clauses = dimacs.first.split(" ")

  clauses = Integer(clauses)
  clauses += additional_dimacs.size

  dimacs[0] = "p cnf #{literals} #{clauses}"
  dimacs
end

def solve_dimacs(binary, dimacs)
  #return File.read("solution.txt") # temporary
  solution = ""

  Open3.popen3(binary) do |input, output, _, _|
    dimacs.each { |line| input.puts line }
    input.close

    while (l = output.gets) do
      puts l
      solution += l
      $stdout.flush
    end
  end

  File.open("solution.txt", "w") { |f| f.puts solution }

  solution
end

def parse_assignments(solution)
  lines = solution.split("\n")

  satisfiable = lines.detect { |l| l.include?("SATISFIABLE") }
  satisfiable = satisfiable.include?("UNSATISFIABLE") ? false : true

  unless satisfiable
    raise "There are no solutions for the given seed"
  end

  literals = []
  assignments = lines.select { |l| l.start_with?("c v ") }
  assignments.map do |line|
    line = line.gsub("c v ", "")
    line = line.gsub(/ 0$/, "")

    line.split(" ").each do |literal|
      literals << Integer(literal)
    end
  end

  literals
end

def build_sentence(seed_prefix, seed_after_first, seed_before_last, numbers)
  sentence = "#{seed_prefix} "
  letters = ("a".."z").to_a

  numbers.each.with_index do |n, index|
    if index == 25
      sentence += "#{seed_before_last} "
    end

    sentence += build_term(numbers[index])

    if index == 0
      sentence += " #{seed_after_first}"
    end

    sentence += " are #{letters[index]}'s"
    sentence += index == 25 ? "." : ", "
  end

  sentence
end

def build_term(number_array)
  term = number_array.first.in_words

  unless number_array[1].zero? && number_array[2].zero?
    term += " point "
    term += number_array[1].in_words

    unless number_array[2].zero?
      term += " "
      term += number_array[2].in_words
    end
  end

  term += " percent"
end

# def extract_seed(original_dimacs, assignments) # temporary
#   mappings = parse_mappings(original_dimacs)
#   variables = {}
#
#   ("a".."z").each do |letter|
#     (0..5).each do |bit|
#       variable = "seed_#{letter}#{bit}"
#       literal = mappings.fetch(variable)
#
#       if assignments.include?(literal)
#         variables.merge!(variable => true)
#       else
#         variables.merge!(variable => false)
#       end
#     end
#   end
#
#   variables
# end

dimacs = generate_dimacs(original_dimacs, seed_prefix, seed_after_first, seed_before_last)
solution = solve_dimacs(binary, dimacs)
assignments = parse_assignments(solution)
variables = variables(original_dimacs, assignments)
numbers = to_numbers(variables)
sentence = build_sentence(seed_prefix, seed_after_first, seed_before_last, numbers)

puts
puts sentence
