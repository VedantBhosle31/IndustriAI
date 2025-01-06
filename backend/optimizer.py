from pulp import LpMaximize,LpMinimize,LpProblem,LpVariable,lpSum

def optimize_esg_projects(projects, ESG_scores, costs, risks, budget, risk_tolerance, min_diversification):
    """
    Optimizes ESG projects selection to maximize impact while adhering to budget and risk constraints.

    Parameters:
        projects (list): List of project names.
        ESG_scores (dict): ESG impact scores for each project.
        costs (dict): Costs for each project.
        risks (dict): Risks for each project.
        budget (float): Total budget available.
        risk_tolerance (float): Maximum allowable risk.
        min_diversification (int): Minimum number of projects to invest in.

    Returns:
        dict: Results containing the status, total ESG impact, and details of each project.
    """
    # Create the problem
    problem = LpProblem("Maximize_ESG_Impact", LpMinimize)

    # Decision variables
    x = {project: LpVariable(f"x_{project}", cat="Binary") for project in projects}  # Binary variables
    y = {project: LpVariable(f"y_{project}", lowBound=0, upBound=1) for project in projects}  # Fraction of budget

    # Objective function: Minimize ESG Risk
    problem += lpSum(ESG_scores[project] * y[project] for project in projects), "Total_ESG_Impact"

    # Constraints
    problem += lpSum(costs[project] * y[project] for project in projects) <= budget, "Budget_Constraint"
    problem += lpSum(risks[project] * y[project] for project in projects) <= risk_tolerance, "Risk_Constraint"
    problem += lpSum(x[project] for project in projects) >= min_diversification, "Diversification_Constraint"

    # Binary-continuous relationship
    for project in projects:
        problem += y[project] * costs[project] <= x[project] * costs[project], f"Binary_Relationship_{project}"

    # Solve the problem
    problem.solve()

    # Prepare results
    results = {
        "status": problem.status,
        "total_esg_impact": problem.objective.value(),
        "projects": []
    }

    for project in projects:
        selected = int(x[project].value())
        budget_fraction = (y[project].value() * costs[project]) / budget if y[project].value() else 0
        results["projects"].append({
            "project": project,
            "selected": selected,
            "budget_fraction": budget_fraction
        })

    return results


# Example Usage
if __name__ == "__main__":
    # Define the data
    projects = ["Project1", "Project2", "Project3", "Project4"]
    ESG_scores = {"Project1": 80, "Project2": 60, "Project3": 70, "Project4": 90}
    costs = {"Project1": 100, "Project2": 150, "Project3": 120, "Project4": 200}
    risks = {"Project1": 0.2, "Project2": 0.3, "Project3": 0.25, "Project4": 0.4}

    budget = 300
    risk_tolerance = 0.25
    min_diversification = 2

    # Call the function
    result = optimize_esg_projects(projects, ESG_scores, costs, risks, budget, risk_tolerance, min_diversification)

    # Print the results
    print("Status:", result["status"])
    print("Objective Value (Total ESG Impact):", result["total_esg_impact"])
    for project_result in result["projects"]:
        print(f"{project_result['project']}: Selected = {project_result['selected']}, "
              f"Budget Fraction = {project_result['budget_fraction']}")