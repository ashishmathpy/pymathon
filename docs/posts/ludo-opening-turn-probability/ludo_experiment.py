"""Simulate the precise opening-turn rule in the accompanying article."""
import random
from itertools import product


def piece_out(roll):
    # Up to three attempts to obtain the first six.
    for attempt in range(3):
        if roll() == 6:
            break
    else:
        return False

    # One six has occurred. A non-six now ends a valid turn.
    for extra in range(2):
        if roll() != 6:
            return True
    return False  # Three consecutive sixes cancel the turn.


def experiment():
    rng = random.Random(20261030)
    theoretical = 3185 / 7776
    checkpoints = {1000, 10000, 100000, 1000000}
    successes = 0
    print("Turns,Successes,Experimental,Theoretical,Error_pp")
    for n in range(1, 1000001):
        successes += piece_out(lambda: rng.randint(1, 6))
        if n in checkpoints:
            estimate = successes / n
            error = 100 * (estimate - theoretical)
            print(f"{n},{successes},{estimate:.8f},"
                  f"{theoretical:.8f},{error:+.5f}")


def test_rules():
    # Complete terminal sequences, 6 = six; 1 = any non-six.
    winning = [(6,1), (6,6,1), (1,6,1), (1,6,6,1),
               (1,1,6,1), (1,1,6,6,1)]
    losing = [(1,1,1), (6,6,6), (1,6,6,6), (1,1,6,6,6)]
    for sequence in winning + losing:
        rolls = iter(sequence)
        assert piece_out(lambda: next(rolls)) == (sequence in winning)
        assert list(rolls) == [], "Incorrect stopping point"
    # Five pre-generated rolls suffice for every possible opening turn.
    # Unused trailing rolls do not change the result.
    count = 0
    for sequence in product(range(1, 7), repeat=5):
        rolls = iter(sequence)
        count += piece_out(lambda: next(rolls))
    assert count == 3185, count
    print("Rule tests passed; exact enumeration: 3185 / 7776.")


if __name__ == "__main__":
    test_rules()
    experiment()
